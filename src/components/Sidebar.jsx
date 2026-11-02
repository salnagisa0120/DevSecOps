const ITEM = [
  ["beranda", "🏠", "Beranda"],
  ["dokter", "💬", "Dokter"],
  ["tes", "📋", "Tes kesehatan"],
];

export default function Sidebar({ halaman, pindah }) {
  return (
    <nav className="ss-side" aria-label="Navigasi utama">
      {ITEM.map(([id, ikon, label]) => (
        <button
          key={id}
          aria-label={label}
          title={label}
          aria-current={halaman === id ? "page" : undefined}
          onClick={() => pindah(id)}
        >
          {ikon}
        </button>
      ))}
    </nav>
  );
}
