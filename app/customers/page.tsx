"use client";
import { useEffect, useState } from 'react';
import { Customer } from '../../lib/types';
import { getCustomers, logActivity, saveCustomers, uuid } from '../../lib/sampleData';

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [form, setForm] = useState({ name: '', email: '', segment: '' });

  useEffect(() => setItems(getCustomers()), []);

  function add() {
    if (!form.email) return;
    const next = [{ id: uuid(), name: form.name || form.email, email: form.email, segment: form.segment || undefined }, ...items];
    saveCustomers(next); setItems(next);
    setForm({ name: '', email: '', segment: '' });
    logActivity('Customer added', next[0].email);
  }

  function update(id: string, patch: Partial<Customer>) {
    const next = items.map(c => c.id === id ? { ...c, ...patch } : c);
    saveCustomers(next); setItems(next);
  }

  function remove(id: string) {
    const next = items.filter(c => c.id !== id);
    saveCustomers(next); setItems(next);
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Add Customer</h3>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr auto', gap:8 }}>
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="input" placeholder="Segment (VIP, Loyal...)" value={form.segment} onChange={e=>setForm({...form, segment:e.target.value})} />
          <button className="button" onClick={add}>Add</button>
        </div>
      </section>

      <section className="card">
        <h3>Customers</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Segment</th><th></th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} style={{ background:'#0f1523' }}>
                <td><input className="input" value={c.name} onChange={e=>update(c.id,{name:e.target.value})} /></td>
                <td><input className="input" value={c.email} onChange={e=>update(c.id,{email:e.target.value})} /></td>
                <td><input className="input" value={c.segment||''} onChange={e=>update(c.id,{segment:e.target.value})} /></td>
                <td><button className="button secondary" onClick={()=>remove(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
