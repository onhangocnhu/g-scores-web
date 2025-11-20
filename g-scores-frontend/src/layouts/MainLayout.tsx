import Header from './HeaderLayout.tsx'
import MainContent from './MainContent.tsx'
import Sidebar from './SidebarLayout.tsx'
import "../styles/MainLayout.css"

function MainLayout() {
  return (
    <div className="root-wrapper">
      <Header />
      <div className="body-wrapper">
        <Sidebar />
        <main className="main-content">
          <MainContent />
        </main>
      </div>
    </div>
  )
}

export default MainLayout