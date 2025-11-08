"use client";
import { useEffect, useState } from 'react';
import { getActivityFeed, onActivity } from '../lib/sampleData';

export function ActivityFeed() {
  const [items, setItems] = useState(getActivityFeed());
  useEffect(() => onActivity(() => setItems(getActivityFeed())), []);

  return (
    <div className="list">
      {items.map((a) => (
        <div key={a.id} className="card" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600 }}>{a.title}</div>
            <div className="badge">{new Date(a.at).toLocaleTimeString()}</div>
          </div>
          <div style={{ color: 'var(--muted)' }}>{a.detail}</div>
        </div>
      ))}
      {items.length === 0 && <div className="badge">No activity yet</div>}
    </div>
  );
}
