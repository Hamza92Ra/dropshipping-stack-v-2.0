import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-[var(--text-muted)] md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} DropshippingStack</span>
        <div className="flex gap-4">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
        </div>
      </div>
    </footer>
  );
}
