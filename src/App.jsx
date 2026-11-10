import { useState, useEffect } from "react";
import "./styles/sehat-selalu.css";
import { api, getToken, setToken } from "./api";

import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import AuthModal from "./components/AuthModal";
import Beranda from "./pages/Beranda";
import DaftarDokter from "./pages/DaftarDokter";
import TesMandiri from "./pages/TesMandiri";
import Chat from "./pages/Chat";

export default function App() {
  const [halaman, setHalaman] = useState("beranda"); // beranda | dokter | chat | tes
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [modal, setModal] = useState(null); // null | "login" | "register"
  const [pesanModal, setPesanModal] = useState("");
  const [tujuan, setTujuan] = useState(null);
  const [dokterAktif, setDokterAktif] = useState("tirta");

  // Ambil daftar dokter + pulihkan sesi login dari token tersimpan
  useEffect(() => {
    api.doctors().then(setDoctors).catch(() => {});
    if (getToken()) {
      api.me().then((d) => setUser(d.user.username)).catch(() => setToken(null));
    }
  }, []);

  const bukaLogin = (pesan = "", lanjut = null) => {
    setPesanModal(pesan);
    setTujuan(lanjut);
    setModal("login");
  };

  const pindah = (h) => {
    if (h === "dokter" && !user) {
      return bukaLogin("Mohon login atau mendaftar untuk melanjutkan", { h: "dokter" });
    }
    setHalaman(h);
  };

  const pilihDokter = (id) => {
    setDokterAktif(id);
    setHalaman("chat");
  };

  const sukses = (nama) => {
    setUser(nama);
    setModal(null);
    if (tujuan?.h) setHalaman(tujuan.h);
    setTujuan(null);
  };

  const keluar = () => {
    setToken(null);
    setUser(null);
    setHalaman("beranda");
  };

  const denganSidebar = halaman === "dokter" || halaman === "tes";

  return (
    <div className="ss">
      <TopBar
        user={user}
        onHome={() => setHalaman("beranda")}
        onLogin={() => bukaLogin()}
        onLogout={keluar}
      />

      <div className="ss-body">
        {denganSidebar && <Sidebar halaman={halaman} pindah={pindah} />}
        {halaman === "beranda" && <Beranda pindah={pindah} />}
        {halaman === "dokter" && <DaftarDokter doctors={doctors} onPilih={pilihDokter} />}
        {halaman === "tes" && <TesMandiri />}
        {halaman === "chat" && (
          <Chat doctors={doctors} aktif={dokterAktif} setAktif={setDokterAktif} />
        )}
      </div>

      {modal && (
        <AuthModal
          key={modal}
          mode={modal}
          setMode={setModal}
          pesan={pesanModal}
          onTutup={() => setModal(null)}
          onSukses={sukses}
        />
      )}
    </div>
  );
}
