import { type ChangeEvent } from "react";

interface RegisterTabProps {
  regName: string;
  setRegName: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regPassword: string;
  setRegPassword: (val: string) => void;
  regPasswordConfirm: string;
  setRegPasswordConfirm: (val: string) => void;
  handleRegister: () => void;
}

export default function RegisterTab({
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regPasswordConfirm,
  setRegPasswordConfirm,
  handleRegister,
}: RegisterTabProps) {
  return (
    <section className="tab-content section">
      <h2>Reģistrācija</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Vārds"
          value={regName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRegName(e.target.value)}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="E-pasts"
          value={regEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRegEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Parole"
          value={regPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRegPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Atkārtojiet paroli"
          value={regPasswordConfirm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRegPasswordConfirm(e.target.value)}
          autoComplete="new-password"
        />
        <button type="button" onClick={handleRegister}>
          Reģistrēties
        </button>
      </div>
    </section>
  );
}