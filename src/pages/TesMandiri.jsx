import { useState } from "react";
import { TES } from "../data/konstanta";

export default function TesMandiri() {
  const [dipilih, setDipilih] = useState(null);
  return (
    <main className="ss-main">
      <h1 className="ss-judul">Tes Kesehatan Mandiri</h1>
      <div className="ss-tes">
        {TES.map((t) => (
          <button key={t.id} className="ss-kartu" onClick={() => setDipilih(t)}>
            <span className="ik" style={{ background: t.warna }}>{t.ikon}</span>
            {t.label}
          </button>
        ))}
      </div>
      {dipilih && (
        <p className="ss-info" role="status" style={{ marginTop: 32 }}>
          Kuesioner “{dipilih.label}” belum tersedia. Hubungkan ke halaman soal Anda di sini.
        </p>
      )}
    </main>
  );
}
