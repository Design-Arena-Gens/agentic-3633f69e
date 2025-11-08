import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Nav } from '../components/Nav';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <div className="nav-inner">
            <div className="brand">A2Z Commerce Agent</div>
            <Nav />
          </div>
        </div>
        <main className="container">{children}</main>
        <div className="footer">Built for autonomous e?commerce ops</div>
      </body>
    </html>
  );
}
