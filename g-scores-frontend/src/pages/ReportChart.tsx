import React, { useState, useEffect } from 'react';
import '../styles/ReportChart.css';
import { ChartCard1 } from '../components/charts/ChartCard';
import type { XaxisData, YaxisData } from '../components/charts/ChartCard'
import type { ScoreReportDto } from '../types/score-report.dto';
import SimpleTable from '../components/common/SimpleTable';
import { SelectGroupSubject } from '../components/features/SelectGroup';

type ChartData = { xAxisData: XaxisData, yAxisData: YaxisData };

const ChartPlaceholder: React.FC<{ data: ScoreReportDto[] }> = ({ data }) => {
  if (data.length === 0) {
    return <p className="loading-text">No data available.</p>;
  }

  const chartData: ChartData = {
    xAxisData: {
      key: "Subjects",
      values: data.map(item => item.subject),
      formatter: (value: string) => value
    },
    yAxisData: [
      {
        key: "Excellent",
        label: "Excellent",
        color: "blue",
        opacity: "100%",
        values: data.map(item => item.excellent)
      },
      {
        key: "Good",
        label: "Good",
        color: "red",
        opacity: "75%",
        values: data.map(item => item.good)
      },
      {
        key: "Average",
        label: "Average",
        color: "green",
        opacity: "50%",
        values: data.map(item => item.average)
      },
      {
        key: "Poor",
        label: "Poor",
        color: "yellow",
        opacity: "25%",
        values: data.map(item => item.poor)
      }
    ]
  }

  return (
    <div className="chart-placeholder mt-5">
      <ChartCard1
        title={`Score Statistic`}
        description=''
        className='flex-1 border-none shadow-none p-2'
        chartCustomSize={360}
        xAxisData={chartData.xAxisData}
        yAxisData={chartData.yAxisData}
        showChartLegend={true}
        footerText={{
          title: "Data updated from the 2024 National Exam",
          subTitle: ''
        }}
      />

      <SimpleTable
        columns={[
          { key: "subject", label: "Subject" },
          { key: "excellent", label: "Excellent" },
          { key: "good", label: "Good" },
          { key: "average", label: "Average" },
          { key: "poor", label: "Poor" },
        ]}
        rows={data.map((item) => ({
          subject: item.subject,
          excellent: item.excellent,
          good: item.good,
          average: item.average,
          poor: item.poor,
        }))}
      />
    </div>
  );
};

export default function ReportChart() {
  const [reportData, setReportData] = useState<ScoreReportDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("natural");

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/student/report/${groupName}`);
        if (!response.ok) throw new Error("Error fetching report");

        const result: ScoreReportDto[] = await response.json();
        setReportData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [groupName]);

  return (
    <div className="report-container">
      <div className="report-placeholder">
        <h2>National High School Exam 2024 - Score Statistics</h2>

        <div className="my-4">
          <SelectGroupSubject groupName={groupName} setGroupName={setGroupName} />
        </div>

        <div style={{ position: "relative", minHeight: "350px" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "600",
                zIndex: 10, 
                backdropFilter: "blur(2px)",
              }}
            >
              Loading...
            </div>
          )}

          {!error && <ChartPlaceholder data={reportData} />}

          {error && (
            <p style={{ textAlign: "center", marginTop: "30px", color: "red" }}>
              Error: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
