interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authToken: string;
  handleLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, authToken, handleLogout }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="nav-brand">API Testēšana</div>
      <div className="nav-links">
        <button
          type="button"
          className={`nav-btn ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Raksti
        </button>
        {!authToken ? (
          <>
            <button
              type="button"
              className={`nav-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Ienākt
            </button>
            <button
              type="button"
              className={`nav-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Reģistrēties
            </button>
          </>
        ) : (
          <button type="button" className="nav-btn btn-danger" onClick={handleLogout}>
            Iziet
          </button>
        )}
      </div>
    </nav>
  );
}