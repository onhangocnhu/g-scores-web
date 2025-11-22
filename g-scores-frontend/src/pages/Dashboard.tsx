import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import search_icon from '../assets/find.png'
import stats_icon from '../assets/analytics.png'
import rank_icon from '../assets/top-three.png'
import HowItWorks2 from '../components/layout/HowItWork';
import trustworthy from '../assets/trustworthy.png'

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <HowItWorks2
        title={{ text: 'G-Scores System' }}
        description={{ text: '' }}
        featureBadge={{ icon: <img src={trustworthy} alt="Trustworthy" className="w-20 h-20" />, text: '' }}
      />

      <h3 className="dashboard-section-title">Key Features</h3>

      <div className="feature-grid">

        <Link to="/search-scores" className="feature-card">
          <img src={search_icon} alt='search' className='image' />
          <h4 className="feature-title">Score Lookup</h4>
          <p className="feature-text">
            Quickly search for exam results using a registration number.
          </p>
        </Link>

        <Link to="/reports" className="feature-card">
          <img src={stats_icon} alt='stats' className='image' />
          <h4 className="feature-title">Performance Statistics</h4>
          <p className="feature-text">
            View categorized score distributions across all subjects.
          </p>
        </Link>

        <Link to="/ranking" className="feature-card">
          <img src={rank_icon} alt='stats' className='image' />
          <h4 className="feature-title">Top Rankings</h4>
          <p className="feature-text">
            Explore the top 10 students in Group 'Natural Science'.
          </p>
        </Link>

      </div>
      <p className="dashboard-footer-text">
        Use the navigation menu above to explore score lookup, detailed reports,
        and analytics for each student and subject.
      </p>
    </div>
  );
}
