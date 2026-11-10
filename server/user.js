import bcrypt from "bcryptjs";
import db from "./db.js";

const [, , username, password] = process.argv;
if (!username || !password || password.length < 6) {
  console.error("Pemakaian: node server/tambah-user.js <username> <password min 6 karakter>");
  process.exit(1);
}
try {
  db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
    .run(username, bcrypt.hashSync(password, 10));
  console.log("User dibuat:", username);
} catch (e) {
  console.error(e.code === "SQLITE_CONSTRAINT_UNIQUE" ? "Username sudah ada." : e.message);
  process.exit(1);
}