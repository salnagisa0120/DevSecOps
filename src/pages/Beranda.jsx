export default function Beranda({ pindah }) {
  return (
    <main className="ss-main ss-home">
      <span className="ss-bentuk ss-lingkar-kecil" />
      <span className="ss-bentuk ss-segitiga-hijau" />
      <span className="ss-bentuk ss-lingkar" />
      <span className="ss-bentuk ss-segitiga-biru" />
      <h1 className="ss-judul">Solusi Kesehatan</h1>
      <div className="ss-menu">
        <button className="ss-pil" onClick={() => pindah("dokter")}>Chat dengan Dokter</button>
        <button className="ss-pil" onClick={() => alert("Toko Kesehatan segera hadir")}>Toko Kesehatan</button>
        <button className="ss-pil" onClick={() => alert("Fitur ini segera hadir")}>Homecare</button>
        <button className="ss-pil tengah" onClick={() => pindah("tes")}>Tes Kesehatan Mandiri</button>
      </div>
    </main>
  );
}
