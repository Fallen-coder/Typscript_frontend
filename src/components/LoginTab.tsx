import { type ChangeEvent } from "react";

interface LoginTabProps {
  authToken: string;
  userName: string;
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  handleLogin: () => void;
}

export default function LoginTab({
  authToken,
  userName,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
}: LoginTabProps) {
  return (
    <section className="tab-content section">
      <h2>Autentifikācija</h2>
      <div className="status-badge">
        Statuss: {authToken ? `Pieslēdzies${userName ? " kā " + userName : ""}` : "Nav pieteicies"}
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="E-pasts"
          value={loginEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Parole"
          value={loginPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="button" onClick={handleLogin}>
          Pieslēgties
        </button>
      </div>
    </section>
  );
}