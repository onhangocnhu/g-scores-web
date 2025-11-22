import React, { useState } from 'react';

export default function ScoreCheck() {
  const [reg, setReg] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function onCheck(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:3000/student/search-scores/${reg}`);
      if (!res.ok) {
        setResult({ notFound: true });
      } else {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      setResult({ error: true });
    }

    setLoading(false);
  }

  return (
    <div>
      <h4>Check score by registration number</h4>

      <form onSubmit={onCheck}>
        <input
          value={reg}
          onChange={e => setReg(e.target.value)}
          placeholder="Enter reg. no"
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {result && result.notFound && (
        <div style={{ marginTop: 12 }}>No student found for "{reg}"</div>
      )}

      {result && !result.notFound && !result.error && (
        <div style={{ marginTop: 12, border: '1px solid #eee', padding: 8 }}>
          <div><strong>{result.candidateId}</strong></div>

          <div style={{ marginTop: 8 }}>
            {result.subjects.map((s: any, index: number) => (
              <div key={index}>
                {s.name}: {s.score ?? 'N/A'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}