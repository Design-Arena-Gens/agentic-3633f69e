"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Dashboard' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
  { href: '/customers', label: 'Customers' },
  { href: '/marketing', label: 'Marketing' },
  { href: '/automations', label: 'Automations' },
  { href: '/support', label: 'Support' }
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav style={{ display: 'flex', gap: 8 }}>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={pathname === i.href ? 'active' : ''}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
