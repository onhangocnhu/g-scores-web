type Series = { name: string; values: number[] };
export default function SubjectChart({ labels, series }: { labels: string[]; series: Series[] }) {
  const max = Math.max(...series.flatMap(s => s.values), 1);
  return (
    <div>
      <h4>Statistics by subject (levels)</h4>
      <div style={{ display: 'flex', gap: 24 }}>
        {series.map(s => (
          <div key={s.name} style={{ width: 120 }}>
            <div style={{ fontWeight: 'bold' }}>{s.name}</div>
            {labels.map((lbl, idx) => {
              const val = s.values[idx];
              const h = (val / max) * 100;
              return (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <div style={{ width: 60, fontSize: 12 }}>{lbl}</div>
                  <div style={{ height: 16, background: '#eee', flex: 1, marginLeft: 8 }}>
                    <div style={{ height: '100%', width: `${h}%`, background: '#4caf50' }} />
                  </div>
                  <div style={{ width: 32, textAlign: 'right', marginLeft: 8 }}>{val}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
