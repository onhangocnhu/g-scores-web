import { useState } from 'react';
import '../styles/SearchScores.css';
import SimpleTable from '../components/common/SimpleTable';

interface SubjectScore {
  name: string;
  score: number | null;
}

interface ScoreResponse {
  candidateId: string;
  foreignLanguageId: string | null;
  subjects: SubjectScore[];
}

export default function SearchScores() {
  const [sbd, setSbd] = useState('');
  const [data, setData] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!sbd) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`https://gscores-latest.onrender.com/student/search-scores/${sbd}`);

      if (!response.ok) {
        throw new Error('ID not found!');
      }

      const result: ScoreResponse = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='score-wrapper'>
      <div className="score-container">
        <h2 className='text-input'>Enter your registration id</h2>
        <h2 className='exam-input'>2024 Vietnam National High School Graduation Examination</h2>
        <div className="score-card">
          <div className="search-box">
            <input
              className="search-input"
              type="text"
              placeholder="01000001"
              value={sbd}
              onChange={(e) => setSbd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          {data && (
            <div className="result-card">
              {data.foreignLanguageId && (
                <p className='result-text'>
                  Foreign Language Code: {data.foreignLanguageId}
                </p>
              )}

              <SimpleTable
                columns={[
                  { key: "subject", label: "Subject" },
                  { key: "score", label: "Score" },
                ]}
                rows={data.subjects
                  .filter((s) => s.score !== null && s.name !== "")
                  .map((s) => ({
                    subject: s.name,
                    score: s.score,
                  }))}
              />

              {data.subjects.every((s) => s.score === null) && (
                <p className="no-data-text">Cannot find any data.</p>
              )}
            </div>
          )}

        </div>
      </div >
    </div>
  );
}