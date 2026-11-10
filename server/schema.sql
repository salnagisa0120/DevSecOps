-- Skema database Sehat Selalu (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS doctors (
  id    TEXT PRIMARY KEY,
  nama  TEXT NOT NULL,
  warna TEXT NOT NULL,
  ikon  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id  TEXT    NOT NULL REFERENCES doctors(id),
  sender     TEXT    NOT NULL CHECK (sender IN ('user', 'doctor')),
  isi        TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_chat
  ON messages (user_id, doctor_id, id);

-- Data awal dokter
INSERT OR IGNORE INTO doctors (id, nama, warna, ikon) VALUES
  ('tirta', 'Dr. Tirta', '#4a8fb5', '🧑‍⚕️'),
  ('gia',   'Dr. Gia',   '#c9c9c9', '👨‍⚕️'),
  ('eno',   'Dr. Eno',   '#7aa63c', '👾');
