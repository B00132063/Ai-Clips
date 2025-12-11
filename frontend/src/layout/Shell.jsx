// src/layout/Shell.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function Shell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const onLogoClick = () => navigate("/");

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/my-clips" && location.pathname.startsWith("/my-clips")) ||
    (path === "/signin" && location.pathname.startsWith("/signin"));

  return (
    <div className="app-root">
      <div className="gradient-overlay" />
      <div className="app-container">
        <header className="app-header">
          <div
            className="logo"
            onClick={onLogoClick}
            style={{ cursor: "pointer" }}
          >
            <span className="logo-highlight">CLIP</span>ZZ
          </div>

          <nav className="nav-links">
            <button
              className={
                "nav-button" + (isActive("/") ? " nav-button-active" : "")
              }
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
            <button
              className={
                "nav-button" +
                (isActive("/my-clips") ? " nav-button-active" : "")
              }
              onClick={() => navigate("/my-clips")}
            >
              My Clips
            </button>
            <button
              className={
                "nav-button nav-button-primary" +
                (isActive("/signin") ? " nav-button-active" : "")
              }
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>
          </nav>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
// End of Shell.jsx