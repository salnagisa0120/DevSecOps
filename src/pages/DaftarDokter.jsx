export default function DaftarDokter({ doctors, onPilih }) {
  return (
    <main className="ss-main">
      <h1 className="ss-judul">Dokter-dokter yang tersedia</h1>
      {doctors.length === 0 && <p className="ss-info">Memuat daftar dokter…</p>}
      <div className="ss-dokter">
        {doctors.map((d) => (
          <button key={d.id} className="ss-dr" onClick={() => onPilih(d.id)}>
            <span className="ss-avatar" style={{ background: d.warna }}>{d.ikon}</span>
            {d.nama}
          </button>
        ))}
      </div>
    </main>
  );
}
