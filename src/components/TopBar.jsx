export default function TopBar({ user, onHome, onLogin, onLogout }) {
  return (
    <header className="ss-top">
      <button className="ss-brand" onClick={onHome}>Sehat Selalu</button>
      {user ? (
        <button className="ss-login-btn" onClick={onLogout} title="Klik untuk keluar">
          {user.toUpperCase()} · KELUAR
        </button>
      ) : (
        <button className="ss-login-btn" onClick={onLogin}>LOGIN</button>
      )}
    </header>
  );
}
