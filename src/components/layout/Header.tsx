import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Sia819
        </Link>
        <div className="flex gap-6 text-sm">
          <Link
            href="/"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
