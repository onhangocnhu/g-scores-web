import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import SearchScores from './pages/SearchScores.tsx';
import Dashboard from './pages/Dashboard.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import ReportChart from './pages/ReportChart.tsx';
import TopRanking from './pages/Ranking.tsx';
import Footer1 from './components/common/Footer1.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="root-container">
        <MainLayout />

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search-scores" element={<SearchScores />} />
          <Route path="/reports" element={<ReportChart />} />
          <Route path="/ranking" element={<TopRanking />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
        <Footer1
          website='gscores.vn'
          websiteDescription='An exclusive platform for exam scores'
          handle='nhu'
          classname='bg-primary text-white'
        />
      </div >
    </BrowserRouter>
  )
}

export default App
