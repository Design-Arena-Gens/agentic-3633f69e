"use client";
import { useEffect, useMemo, useState } from 'react';
import { Order, Product } from '../../lib/types';
import { getOrders, getProducts, logActivity, saveOrders, simulateOrderPaid, uuid } from '../../lib/sampleData';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selection, setSelection] = useState<{productId: string; qty: number}>({ productId: '', qty: 1 });

  useEffect(() => { setOrders(getOrders()); setProducts(getProducts()); }, []);

  const total = useMemo(() => {
    const p = products.find(p => p.id === selection.productId);
    return (p ? p.price : 0) * selection.qty;
  }, [selection, products]);

  function createOrder() {
    if (!selection.productId) return;
    const id = uuid();
    const itemProduct = products.find(p => p.id === selection.productId)!;
    const order: Order = {
      id,
      customerId: 'c1',
      items: [{ productId: selection.productId, qty: selection.qty, price: itemProduct.price }],
      total,
      status: 'pending',
      createdAt: Date.now()
    };
    const next = [order, ...orders];
    saveOrders(next); setOrders(next);
    logActivity('Order created', id);
  }

  function updateStatus(id: string, status: Order['status']) {
    const next = orders.map(o => o.id === id ? { ...o, status } : o);
    saveOrders(next); setOrders(next);
    if (status === 'paid') simulateOrderPaid(id);
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Create Order</h3>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:8 }}>
          <select className="input" value={selection.productId} onChange={e=>setSelection({...selection, productId:e.target.value})}>
            <option value="">Select product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.title} (${p.price})</option>)}
          </select>
          <input className="input" type="number" value={selection.qty} onChange={e=>setSelection({...selection, qty:Number(e.target.value)})} />
          <div className="badge">Total: ${total}</div>
          <button className="button" onClick={createOrder}>Create</button>
        </div>
      </section>

      <section className="card">
        <h3>Orders</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Total</th><th>Status</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ background:'#0f1523' }}>
                <td>{o.id}</td>
                <td>${o.total}</td>
                <td>
                  <select className="input" value={o.status} onChange={e=>updateStatus(o.id, e.target.value as Order['status'])}>
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="fulfilled">fulfilled</option>
                    <option value="cancelled">cancelled</option>
                    <option value="refunded">refunded</option>
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
