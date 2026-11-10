import { useState, useRef, useEffect } from "react";
import { api } from "../api";

export default function Chat({ doctors, aktif, setAktif }) {
  const [riwayat, setRiwayat] = useState({});
  const [teks, setTeks] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState("");
  const ujung = useRef(null);

  const dr = doctors.find((d) => d.id === aktif) || doctors[0];
  const pesan = (dr && riwayat[dr.id]) || [];

  // Muat riwayat dari database saat dokter berganti
  useEffect(() => {
    if (!dr) return;
    let batal = false;
    setMemuat(true);
    setGalat("");
    api
      .messages(dr.id)
      .then((d) => !batal && setRiwayat((r) => ({ ...r, [dr.id]: d.pesan })))
      .catch((e) => !batal && setGalat(e.message))
      .finally(() => !batal && setMemuat(false));
    return () => { batal = true; };
  }, [dr?.id]);

  useEffect(() => {
    ujung.current?.scrollIntoView({ block: "end" });
  }, [pesan.length, aktif]);

  if (!dr) return <main className="ss-main"><p className="ss-info">Memuat…</p></main>;

  const kirim = async (e) => {
    e.preventDefault();
    const isi = teks.trim();
    if (!isi || mengirim) return;
    const id = dr.id;
    setTeks("");
    setMengirim(true);
    setGalat("");
    try {
      const d = await api.sendMessage(id, isi);
      setRiwayat((r) => ({ ...r, [id]: [...(r[id] || []), ...d.pesan] }));
    } catch (err) {
      setGalat(err.message);
      setTeks(isi); // kembalikan teks agar tidak hilang
    } finally {
      setMengirim(false);
    }
  };

  return (
    <div className="ss-chat">
      <aside className="ss-chat-side" aria-label="Daftar dokter">
        <span className="tit">Dokter</span>
        {doctors.map((d) => (
          <button key={d.id} aria-current={d.id === dr.id} onClick={() => setAktif(d.id)}>
            <span className="ss-mini" style={{ background: d.warna }}>{d.ikon}</span>
            {d.nama}
          </button>
        ))}
      </aside>
      <section className="ss-chat-main">
        <div className="ss-chat-head"><span>Pesan</span></div>
        <div className="ss-chat-dr">
          <span className="ss-mini" style={{ background: dr.warna }}>{dr.ikon}</span>
          {dr.nama}
        </div>
        <div className="ss-pesan" aria-live="polite">
          {memuat && <p className="ss-kosong">Memuat riwayat…</p>}
          {!memuat && pesan.length === 0 && (
            <p className="ss-kosong">Belum ada pesan. Mulai percakapan dengan {dr.nama}.</p>
          )}
          {pesan.map((p) => (
            <div key={p.id} className={`ss-gelembung ${p.dari}`}>{p.isi}</div>
          ))}
          <div ref={ujung} />
        </div>
        {galat && <p className="ss-galat" role="alert">{galat}</p>}
        <form className="ss-input" onSubmit={kirim}>
          <input
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            placeholder="Ketik pesan..."
            aria-label="Ketik pesan"
            maxLength={1000}
          />
          <button type="submit" disabled={mengirim}>{mengirim ? "..." : "Kirim"}</button>
        </form>
      </section>
    </div>
  );
}
