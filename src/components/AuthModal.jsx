import { useState } from "react";

export default function AuthModal({ mode, setMode, pesan, onTutup, onSukses }) {
  const [f, setF] = useState({ username: "", password: "", konfirmasi: "" });
  const [err, setErr] = useState("");
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const register = mode === "register";

  const submit = (e) => {
    e.preventDefault();
    if (!f.username.trim() || !f.password) return setErr("Username dan password wajib diisi.");
    if (register && f.password !== f.konfirmasi) return setErr("Konfirmasi password tidak sama.");
    // TODO: sambungkan ke API autentikasi Anda
    onSukses(f.username.trim());
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
        <input placeholder="Username" value={f.username} onChange={ubah("username")} aria-label="Username" autoFocus />
        <input type="password" placeholder="Password" value={f.password} onChange={ubah("password")} aria-label="Password" />
        {register && (
          <input type="password" placeholder="Konfirmasi password" value={f.konfirmasi} onChange={ubah("konfirmasi")} aria-label="Konfirmasi password" />
        )}
        {err && <p className="err" role="alert">{err}</p>}
        <button type="submit" className="ss-aksi">{register ? "DAFTAR" : "LOGIN"}</button>
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
