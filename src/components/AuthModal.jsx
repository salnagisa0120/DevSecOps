import { useState } from "react";
import { api, setToken } from "../api";

export default function AuthModal({ mode, setMode, pesan, onTutup, onSukses }) {
  const [f, setF] = useState({ username: "", password: "", konfirmasi: "" });
  const [err, setErr] = useState("");
  const [memuat, setMemuat] = useState(false);
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const register = mode === "register";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!f.username.trim() || !f.password) return setErr("Username dan password wajib diisi.");
    if (register && f.password !== f.konfirmasi) return setErr("Konfirmasi password tidak sama.");

    setMemuat(true);
    try {
      const aksi = register ? api.register : api.login;
      const { token, user } = await aksi(f.username.trim(), f.password);
      setToken(token);
      onSukses(user.username);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setMemuat(false);
    }
  };

  return (
    <div className="ss-overlay" onClick={onTutup}>
      <form
        className="ss-modal"
        role="dialog"
        aria-modal="true"
        aria-label={register ? "Daftar" : "Login"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <button type="button" className="ss-tutup" aria-label="Tutup" onClick={onTutup}>✕</button>
        {pesan && !register && <p className="info">{pesan}</p>}
        <h2>{register ? "REGISTER" : "LOGIN"}</h2>
        <input placeholder="Username" value={f.username} onChange={ubah("username")} aria-label="Username" autoFocus autoComplete="username" />
        <input type="password" placeholder="Password" value={f.password} onChange={ubah("password")} aria-label="Password" autoComplete={register ? "new-password" : "current-password"} />
        {register && (
          <input type="password" placeholder="Konfirmasi password" value={f.konfirmasi} onChange={ubah("konfirmasi")} aria-label="Konfirmasi password" autoComplete="new-password" />
        )}
        {err && <p className="err" role="alert">{err}</p>}
        <button type="submit" className="ss-aksi" disabled={memuat}>
          {memuat ? "..." : register ? "DAFTAR" : "LOGIN"}
        </button>
        <p className="alih">
          {register ? "Sudah punya akun?" : "Belum punya akun?"}
          <button type="button" onClick={() => { setErr(""); setMode(register ? "login" : "register"); }}>
            {register ? "Login di sini" : "Daftar di sini"}
          </button>
        </p>
      </form>
    </div>
  );
}
