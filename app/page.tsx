"use client";
import { useEffect, useMemo, useState } from 'react';
import { getAllStats } from '../lib/sampleData';
import { ActivityFeed } from '../components/ActivityFeed';

export default function DashboardPage() {
  const [stats, setStats] = useState(getAllStats());

  useEffect(() => {
    const i = setInterval(() => setStats(getAllStats()), 1500);
    return () => clearInterval(i);
  }, []);

  const kpis = useMemo(
    () => [
      { label: 'Revenue (30d)', value: `$${stats.revenue30d.toLocaleString()}` },
      { label: 'Orders (30d)', value: stats.orders30d.toLocaleString() },
      { label: 'AOV', value: `$${stats.aov.toFixed(2)}` },
      { label: 'Conversion', value: `${stats.conversion.toFixed(2)}%` },
    ],
    [stats]
  );

  return (
    <div className="grid">
      {kpis.map((k) => (
        <section className="card half" key={k.label}>
          <div className="kpi">
            <div>
              <div className="value">{k.value}</div>
              <div className="badge">{k.label}</div>
            </div>
            <div className="badge">Live</div>
          </div>
        </section>
      ))}
      <section className="card">
        <h3>Recent Automation Activity</h3>
        <ActivityFeed />
      </section>
    </div>
  );
}
