import "../styles/HeaderLayout.css"
import { SidebarTrigger } from "../components/ui/sidebar";
import LogoGO from "../components/LogoGO"

function Header() {
  return (
    <div className="header-container">
      <div className="header-left">
        <div className="header-logo">
          <LogoGO />
        </div>
        <SidebarTrigger className="menu-btn" />
      </div>
      <h1 className="header-title">G-Scores</h1>
    </div>
  )
}

export default Header