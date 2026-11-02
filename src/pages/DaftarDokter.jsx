import { DOKTER } from "../data/konstanta";

export default function DaftarDokter({ onPilih }) {
  return (
    <main className="ss-main">
      <h1 className="ss-judul">Dokter-dokter yang tersedia</h1>
      <div className="ss-dokter">
        {DOKTER.map((d) => (
          <button key={d.id} className="ss-dr" onClick={() => onPilih(d.id)}>
            <span className="ss-avatar" style={{ background: d.warna }}>{d.ikon}</span>
            {d.nama}
          </button>
        ))}
      </div>
    </main>
  );
}
