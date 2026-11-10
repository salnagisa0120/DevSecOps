import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import db from "./db.js";

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "rahasia-dev-ganti-di-produksi";
if (!process.env.JWT_SECRET) {
  console.warn("⚠  JWT_SECRET belum diatur — memakai nilai default (hanya untuk development).");
}

const app = express();
app.use(express.json({ limit: "10kb" }));

/* ---------- Helper ---------- */
const buatToken = (u) =>
  jwt.sign({ id: u.id, username: u.username }, JWT_SECRET, { expiresIn: "7d" });

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Silakan login terlebih dahulu." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Sesi tidak valid, silakan login ulang." });
  }
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan, coba lagi nanti." },
});

/* ---------- Auth ---------- */
const stmtCariUser = db.prepare("SELECT * FROM users WHERE username = ?");
const stmtBuatUser = db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");

app.post("/api/auth/register", authLimiter, (req, res) => {
  const username = String(req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");

  if (!/^[A-Za-z0-9_]{3,30}$/.test(username))
    return res.status(400).json({ error: "Username 3–30 karakter: huruf, angka, atau underscore." });
  if (password.length < 6 || password.length > 100)
    return res.status(400).json({ error: "Password minimal 6 karakter." });
  if (stmtCariUser.get(username))
    return res.status(409).json({ error: "Username sudah dipakai." });

  const hash = bcrypt.hashSync(password, 10);
  const info = stmtBuatUser.run(username, hash);
  const user = { id: Number(info.lastInsertRowid), username };
  res.status(201).json({ token: buatToken(user), user });
});

app.post("/api/auth/login", authLimiter, (req, res) => {
  const username = String(req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");
  const row = stmtCariUser.get(username);

  // Pesan sengaja disamakan agar tidak membocorkan username yang terdaftar
  if (!row || !bcrypt.compareSync(password, row.password_hash))
    return res.status(401).json({ error: "Username atau password salah." });

  const user = { id: row.id, username: row.username };
  res.json({ token: buatToken(user), user });
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username } });
});

/* ---------- Dokter ---------- */
app.get("/api/doctors", (_req, res) => {
  res.json(db.prepare("SELECT id, nama, warna, ikon FROM doctors ORDER BY rowid").all());
});

/* ---------- Pesan ---------- */
const stmtDokter = db.prepare("SELECT id FROM doctors WHERE id = ?");
const stmtRiwayat = db.prepare(
  "SELECT id, sender, isi FROM messages WHERE user_id = ? AND doctor_id = ? ORDER BY id"
);
const stmtSimpan = db.prepare(
  "INSERT INTO messages (user_id, doctor_id, sender, isi) VALUES (?, ?, ?, ?)"
);
const format = (m) => ({ id: m.id, dari: m.sender === "user" ? "saya" : "dokter", isi: m.isi });

const BALASAN = [
  "Terima kasih sudah menghubungi. Ceritakan lebih lanjut keluhan Anda.",
  "Sudah berapa lama gejala ini Anda rasakan?",
  "Saya mengerti. Apakah ada gejala lain yang menyertai?",
];

app.get("/api/messages/:doctorId", auth, (req, res) => {
  if (!stmtDokter.get(req.params.doctorId))
    return res.status(404).json({ error: "Dokter tidak ditemukan." });
  const rows = stmtRiwayat.all(req.user.id, req.params.doctorId);
  res.json({ pesan: rows.map(format) });
});

app.post("/api/messages/:doctorId", auth, (req, res) => {
  const doctorId = req.params.doctorId;
  const isi = String(req.body?.isi ?? "").trim();

  if (!stmtDokter.get(doctorId)) return res.status(404).json({ error: "Dokter tidak ditemukan." });
  if (!isi || isi.length > 1000)
    return res.status(400).json({ error: "Pesan harus 1–1000 karakter." });

  const simpan = db.transaction(() => {
    const a = stmtSimpan.run(req.user.id, doctorId, "user", isi);
    const balasan = BALASAN[Math.floor(Math.random() * BALASAN.length)];
    // Balasan otomatis (simulasi). Ganti dengan alur dokter sungguhan nanti.
    const b = stmtSimpan.run(req.user.id, doctorId, "doctor", balasan);
    return [
      { id: Number(a.lastInsertRowid), dari: "saya", isi },
      { id: Number(b.lastInsertRowid), dari: "dokter", isi: balasan },
    ];
  });

  res.status(201).json({ pesan: simpan() });
});

app.listen(PORT, () => console.log(`API berjalan di http://localhost:${PORT}`));
