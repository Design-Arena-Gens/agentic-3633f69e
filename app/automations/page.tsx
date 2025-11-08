"use client";
import { useEffect, useState } from 'react';
import { AutomationRule } from '../../lib/types';
import { evaluateRules, getRules, logActivity, saveRules } from '../../lib/sampleData';

export default function AutomationsPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [form, setForm] = useState<AutomationRule>({ id: '', name: '', trigger: 'low_stock', action: 'restock_alert', enabled: true, threshold: 10 });

  useEffect(() => setRules(getRules()), []);

  function add() {
    if (!form.name) return;
    const rule = { ...form, id: Math.random().toString(36).slice(2) };
    const next = [rule, ...rules];
    saveRules(next); setRules(next);
    logActivity('Rule added', rule.name);
  }

  function toggle(rule: AutomationRule) {
    const next = rules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r);
    saveRules(next); setRules(next);
  }

  function remove(id: string) {
    const next = rules.filter(r => r.id !== id);
    saveRules(next); setRules(next);
  }

  function test(trigger: AutomationRule['trigger']) {
    evaluateRules(trigger);
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Add Rule</h3>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:8 }}>
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <select className="input" value={form.trigger} onChange={e=>setForm({...form, trigger:e.target.value as any})}>
            <option value="low_stock">low_stock</option>
            <option value="vip_order">vip_order</option>
            <option value="order_paid">order_paid</option>
            <option value="abandoned_cart">abandoned_cart</option>
            <option value="new_customer">new_customer</option>
          </select>
          <select className="input" value={form.action} onChange={e=>setForm({...form, action:e.target.value as any})}>
            <option value="restock_alert">restock_alert</option>
            <option value="send_email">send_email</option>
            <option value="create_discount">create_discount</option>
            <option value="notify_slack">notify_slack</option>
            <option value="tag_customer">tag_customer</option>
          </select>
          <input className="input" type="number" placeholder="Threshold" value={form.threshold ?? 0} onChange={e=>setForm({...form, threshold:Number(e.target.value)})} />
          <button className="button" onClick={add}>Add</button>
        </div>
      </section>

      <section className="card">
        <h3>Rules</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Trigger</th><th>Action</th><th>Enabled</th><th>Test</th><th></th></tr></thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.id} style={{ background:'#0f1523' }}>
                <td>{r.name}</td>
                <td>{r.trigger}</td>
                <td>{r.action}</td>
                <td><button className="button secondary" onClick={()=>toggle(r)}>{r.enabled ? 'On' : 'Off'}</button></td>
                <td><button className="button" onClick={()=>test(r.trigger)}>Run</button></td>
                <td><button className="button secondary" onClick={()=>remove(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
