"use client";
import { useMemo, useState } from 'react';
import { logActivity } from '../../lib/sampleData';

const canned = [
  { tag: 'shipping', text: 'Thanks for reaching out! Orders ship within 24?48 hours.' },
  { tag: 'return', text: 'We offer 30-day hassle-free returns. I can help you start one.' },
  { tag: 'size', text: 'Our apparel runs true to size. If between, size up for relaxed fit.' },
  { tag: 'discount', text: 'Use code WELCOME10 for 10% off your first order!' }
];

function classify(message: string) {
  const m = message.toLowerCase();
  if (m.includes('ship') || m.includes('delivery')) return 'shipping';
  if (m.includes('return') || m.includes('refund')) return 'return';
  if (m.includes('size')) return 'size';
  if (m.includes('discount') || m.includes('code')) return 'discount';
  return 'general';
}

export default function SupportPage() {
  const [input, setInput] = useState('');
  const tag = useMemo(() => classify(input), [input]);
  const suggestion = useMemo(() => canned.find(c => c.tag === tag)?.text || 'Thanks for your message! How can I help?', [tag]);

  function send() {
    if (!input.trim()) return;
    logActivity('Support reply suggested', `Topic: ${tag}`);
    setInput('');
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Customer Message</h3>
        <textarea className="input" rows={6} placeholder="Paste customer message" value={input} onChange={e=>setInput(e.target.value)} />
      </section>

      <section className="card">
        <h3>Suggested Reply</h3>
        <div style={{ whiteSpace:'pre-wrap' }}>{suggestion}</div>
        <div style={{ marginTop: 8, display:'flex', gap:8, alignItems:'center' }}>
          <div className="badge">Topic: {tag}</div>
          <button className="button" onClick={send}>Mark as sent</button>
        </div>
      </section>
    </div>
  );
}
