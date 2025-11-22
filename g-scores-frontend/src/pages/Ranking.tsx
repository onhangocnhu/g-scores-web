import { useEffect, useState } from "react";
import "../styles/Ranking.css";
import SimpleTable from "../components/common/SimpleTable";
import type { RankingDto } from "../types/ranking.dto";
import medal_1 from '../assets/medal.png'
import medal_2 from '../assets/medal-2.png'
import medal_3 from '../assets/medal-3.png'

const medalMap: Record<number, string> = {
  1: medal_1,
  2: medal_2,
  3: medal_3,
};

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch("https://gscores-latest.onrender.com/student/ranking");

        if (!res.ok) throw new Error("Failed to load ranking data.");

        const data: RankingDto[] = await res.json();
        setRanking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (error) return <p>Error: {error}</p>;

  const top3 = ranking.slice(0, 3);
  const top10 = ranking.slice(0, 10);

  return (
    <div className="ranking-wrapper">

      {loading && (
        <div className="ranking-loading-overlay">
          Loading...
        </div>
      )}

      {!loading && ranking.length > 0 && (
        <div className="ranking-container">

          <h2>Top Ranking - Natural Sciences</h2>

          <div className="top3-row">
            {top3.map((student, index) => (
              <div key={index} className={`top-card top-${index + 1}`}>
                <div className="medal">
                  {index + 1 <= 3 ? (
                    <img
                      src={medalMap[index + 1]}
                      alt={`medal ${index + 1}`}
                      className="medal-img"
                    />
                  ) : (
                    index + 1
                  )}
                </div>

                <h3>{student.candidateId}</h3>
                <p>Total Score: {student.totalScore}</p>

                <div className="subscores">
                  <span>Math: {student.math}</span>
                  <span>Physics: {student.physics}</span>
                  <span>Chemistry: {student.chemistry}</span>
                </div>
              </div>
            ))}
          </div>

          {/* TOP 10 TABLE */}
          <div className="top-table-wrapper">
            <h3>Top 10 Students</h3>

            <SimpleTable
              columns={[
                { key: "rank", label: "#" },
                { key: "candidateId", label: "Candidate ID" },
                { key: "math", label: "Math" },
                { key: "physics", label: "Physics" },
                { key: "chemistry", label: "Chemistry" },
                { key: "totalScore", label: "Total" },
              ]}
              rows={top10.map((s, i) => ({ rank: i + 1, ...s }))}
            />
          </div>
        </div>
      )}

      {!loading && ranking.length === 0 && (
        <p>No ranking data available.</p>
      )}
    </div>
  );
}
