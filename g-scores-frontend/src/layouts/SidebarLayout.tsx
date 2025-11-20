import "../styles/SidebarLayout.css"

function Sidebar() {
  return (
    <aside className="class-sidebar">
      <h2 className="menu-title">Menu</h2>
      <ul>
        <li>Dashboard</li>
        <li>Search Scores</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </aside>
  )
}

export default Sidebar