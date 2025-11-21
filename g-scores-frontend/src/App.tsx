// import { useState } from 'react'
import './App.css'
import Header from './layouts/HeaderLayout.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <div className="root-container">
          <AppSidebar />

          <SidebarInset>
            <Header />

            <MainLayout />
          </SidebarInset>
          <main>
            {children}
          </main>
        </div >
      </SidebarProvider>
    </>
  )
}
// function App() {
//   return (
//     <>
//       <div className="root-container">
//         <Header />
//         <div className="layout-container">
//           <Sidebar />
//         </div>
//         <MainLayout />
//       </div>
//     </>
//   )
// }

export default App
