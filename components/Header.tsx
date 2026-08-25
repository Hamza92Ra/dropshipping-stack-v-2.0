import Link from 'next/link';
import type { SessionUser } from '@/lib/session';

export default function Header({ user }: { user: SessionUser | null }) {
  return (
    <header className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl font-semibold text-sage-700">
          DropshippingStack
        </Link>

        {/* Mobile menu button */}
        <button
          id="hamburger-btn"
          aria-label="Toggle menu"
          aria-expanded="false"
          aria-controls="mobile-nav"
          className="flex flex-col gap-1.5 p-2 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="block h-0.5 w-6 bg-current" />
          <span className="block h-0.5 w-6 bg-current" />
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/">Home</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/stack-builder">Stack Builder</Link>
          <Link href="/calculator">Calculator</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/submit">Submit</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/bookmarks">Bookmarks</Link>
              <Link href="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link
                href="/register"
                className="rounded-full bg-sage-500 px-4 py-1.5 text-white hover:bg-sage-600"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile nav panel — toggled via app/mobile-nav.js */}
      <nav id="mobile-nav" hidden className="flex flex-col gap-2 border-t px-4 py-3 md:hidden" style={{ borderColor: 'var(--border)' }}>
        <Link href="/">Home</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/stack-builder">Stack Builder</Link>
        <Link href="/calculator">Calculator</Link>
        <Link href="/roadmap">Roadmap</Link>
          <Link href="/submit">Submit</Link>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/bookmarks">Bookmarks</Link>
            <Link href="/profile">Profile</Link>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/register">Sign up</Link>
          </>
        )}
      </nav>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function () {
              var btn = document.getElementById('hamburger-btn');
              var nav = document.getElementById('mobile-nav');
              if (!btn || !nav) return;
              btn.addEventListener('click', function () {
                var isHidden = nav.hasAttribute('hidden');
                if (isHidden) { nav.removeAttribute('hidden'); btn.setAttribute('aria-expanded', 'true'); }
                else { nav.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); }
              });
            });
          `
        }}
      />
    </header>
  );
}
