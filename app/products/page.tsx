"use client";
import { useEffect, useState } from 'react';
import { Product } from '../../lib/types';
import { evaluateRules, getProducts, logActivity, saveProducts, uuid } from '../../lib/sampleData';

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState({ title: '', price: 0, stock: 0 });

  useEffect(() => setItems(getProducts()), []);

  function add() {
    if (!form.title.trim()) return;
    const next = [{ id: uuid(), title: form.title, price: Number(form.price), stock: Number(form.stock), status: 'active' as const }, ...items];
    saveProducts(next); setItems(next);
    setForm({ title: '', price: 0, stock: 0 });
    logActivity('Product added', form.title);
    evaluateRules('low_stock');
  }

  function update(id: string, patch: Partial<Product>) {
    const next = items.map(p => p.id === id ? { ...p, ...patch } : p);
    saveProducts(next); setItems(next);
  }

  function remove(id: string) {
    const next = items.filter(p => p.id !== id);
    saveProducts(next); setItems(next);
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Add Product</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8 }}>
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <input className="input" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
          <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} />
          <button className="button" onClick={add}>Add</button>
        </div>
      </section>

      <section className="card">
        <h3>Catalog</h3>
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} style={{ background:'#0f1523' }}>
                <td>
                  <input className="input" value={p.title} onChange={e=>update(p.id,{title:e.target.value})} />
                </td>
                <td>
                  <input className="input" type="number" value={p.price} onChange={e=>update(p.id,{price:Number(e.target.value)})} />
                </td>
                <td>
                  <input className="input" type="number" value={p.stock} onChange={e=>update(p.id,{stock:Number(e.target.value)})} />
                </td>
                <td>
                  <select className="input" value={p.status} onChange={e=>update(p.id,{status:e.target.value as Product['status']})}>
                    <option value="active">active</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
                <td>
                  <button className="button secondary" onClick={()=>remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
