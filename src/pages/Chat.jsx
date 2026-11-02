import { useState, useRef, useEffect } from "react";
import { DOKTER } from "../data/konstanta";

export default function Chat({ aktif, setAktif }) {
  const [riwayat, setRiwayat] = useState({});
  const [teks, setTeks] = useState("");
  const ujung = useRef(null);
  const dr = DOKTER.find((d) => d.id === aktif) || DOKTER[0];
  const pesan = riwayat[dr.id] || [];

  useEffect(() => {
    ujung.current?.scrollIntoView({ block: "end" });
  }, [pesan.length, aktif]);

  const tambah = (id, p) =>
    setRiwayat((r) => ({ ...r, [id]: [...(r[id] || []), p] }));

  const kirim = (e) => {
    e.preventDefault();
    const isi = teks.trim();
    if (!isi) return;
    const id = dr.id;
    tambah(id, { dari: "saya", isi });
    setTeks("");
    // balasan simulasi — ganti dengan WebSocket / API Anda
    setTimeout(
      () => tambah(id, { dari: "dokter", isi: "Terima kasih, ceritakan lebih lanjut keluhan Anda." }),
      900
    );
  };

  return (
    <div className="ss-chat">
      <aside className="ss-chat-side" aria-label="Daftar dokter">
        <span className="tit">Dokter</span>
        {DOKTER.map((d) => (
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
          {pesan.length === 0 && (
            <p className="ss-kosong">Belum ada pesan. Mulai percakapan dengan {dr.nama}.</p>
          )}
          {pesan.map((p, i) => (
            <div key={i} className={`ss-gelembung ${p.dari}`}>{p.isi}</div>
          ))}
          <div ref={ujung} />
        </div>
        <form className="ss-input" onSubmit={kirim}>
          <input
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            placeholder="Ketik pesan..."
            aria-label="Ketik pesan"
          />
          <button type="submit">Kirim</button>
        </form>
      </section>
    </div>
  );
}
