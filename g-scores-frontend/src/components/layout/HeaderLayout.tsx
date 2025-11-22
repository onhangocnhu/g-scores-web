import "../../styles/HeaderLayout.css"
import { Link, useLocation } from "react-router-dom"
import LogoGO from "../common/LogoGO"

function Header() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Search Scores", path: "/search-scores" },
    { name: "Reports", path: "/reports" },
    { name: "Ranking", path: "/ranking" },
  ];
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">
            <LogoGO />
          </div>
        </div>
        <h1 className="header-title">G-Scores</h1>

      </div>

      <nav className="navbar">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path
                ? "nav-item active"
                : "nav-item"
            }
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Header