"use client";
import { useEffect, useMemo, useState } from 'react';
import { Campaign } from '../../lib/types';
import { getCampaigns, logActivity, saveCampaigns, uuid } from '../../lib/sampleData';

function generateMessage(goal: string, product: string, tone: string) {
  const openers = {
    friendly: ['Hey there', 'Salaam', 'Hi friend'],
    urgent: ['Last chance', 'Ends tonight', 'Hurry up'],
    luxury: ['Exclusively for you', 'Indulge in comfort', 'Premium drop']
  } as const;
  const benefits = [
    'crafted for everyday comfort',
    'built with sustainable materials',
    'designed to turn heads',
    'now with free shipping'
  ];
  const callouts = ['Save 20% today', 'Limited stock', 'New colors just in'];
  const o = (openers as any)[tone]?.[Math.floor(Math.random()*3)] || 'Hey';
  const b = benefits[Math.floor(Math.random()*benefits.length)];
  const c = callouts[Math.floor(Math.random()*callouts.length)];
  return `${o}! ${product} ? ${b}. ${c}. Goal: ${goal}.`;
}

export default function MarketingPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [form, setForm] = useState({ title: '', channel: 'email' as Campaign['channel'], product: '', goal: '', tone: 'friendly' });

  useEffect(() => setItems(getCampaigns()), []);

  const preview = useMemo(() => generateMessage(form.goal, form.product, form.tone), [form]);

  function schedule() {
    const campaign: Campaign = {
      id: uuid(), title: form.title || 'Campaign', channel: form.channel, audience: 'All customers', message: preview, scheduledAt: Date.now() + 1000*5
    };
    const next = [campaign, ...items];
    saveCampaigns(next); setItems(next);
    logActivity('Campaign scheduled', `${campaign.title} via ${campaign.channel}`);
    setTimeout(() => {
      const updated = next.map(c => c.id === campaign.id ? { ...c, sentAt: Date.now() } : c);
      saveCampaigns(updated); setItems(updated);
      logActivity('Campaign sent', `${campaign.title}`);
    }, 6000);
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Generate Campaign</h3>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8 }}>
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <select className="input" value={form.channel} onChange={e=>setForm({...form, channel:e.target.value as Campaign['channel']})}>
            <option value="email">email</option>
            <option value="sms">sms</option>
            <option value="ads">ads</option>
          </select>
          <input className="input" placeholder="Product" value={form.product} onChange={e=>setForm({...form, product:e.target.value})} />
          <input className="input" placeholder="Goal (e.g., drive sales)" value={form.goal} onChange={e=>setForm({...form, goal:e.target.value})} />
          <select className="input" value={form.tone} onChange={e=>setForm({...form, tone:e.target.value})}>
            <option value="friendly">friendly</option>
            <option value="urgent">urgent</option>
            <option value="luxury">luxury</option>
          </select>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div className="badge">Preview</div>
          <div style={{ marginTop: 6 }}>{preview}</div>
          <button className="button" style={{ marginTop: 12 }} onClick={schedule}>Schedule</button>
        </div>
      </section>

      <section className="card">
        <h3>Campaigns</h3>
        <table className="table">
          <thead><tr><th>Title</th><th>Channel</th><th>Status</th><th>Message</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} style={{ background:'#0f1523' }}>
                <td>{c.title}</td>
                <td>{c.channel}</td>
                <td>{c.sentAt ? 'sent' : 'scheduled'}</td>
                <td style={{ color:'var(--muted)' }}>{c.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
