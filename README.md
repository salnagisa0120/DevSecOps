# Sehat Selalu

## Menjalankan
    npm install
    npm start          # web (5173) + API (3001) sekaligus

Atau di dua terminal: `npm run dev` dan `npm run server`.

Windows PowerShell yang memblokir npm: pakai `npm.cmd` atau Command Prompt.

## Database
SQLite, file dibuat otomatis di `server/sehat_selalu.db` saat server pertama jalan.
Skema ada di `server/schema.sql` (tabel users, doctors, messages).

## Keamanan
- Password di-hash dengan bcrypt, tidak disimpan polos.
- Atur rahasia JWT sebelum produksi:
  PowerShell: `$env:JWT_SECRET="isi-acak-panjang"; npm run server`
