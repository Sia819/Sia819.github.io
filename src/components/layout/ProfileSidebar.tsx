import ThemeToggle from '@/components/common/ThemeToggle';
import { profile } from '@/data/profile';

export default function ProfileSidebar() {
  return (
    <aside
      className="sidebar-texture hidden w-[260px] shrink-0 flex-col items-center px-6 py-10 md:flex"
      style={{ backgroundColor: 'var(--kraft)' }}
    >
      <img
        src={profile.avatar}
        alt={profile.name}
        className="mb-5 h-28 w-28 rounded-full object-cover"
        style={{ border: '3px solid var(--kraft-light)' }}
      />
      <h1
        className="mb-1 text-center text-xl font-bold"
        style={{ color: 'var(--sidebar-name)' }}
      >
        {profile.name}
      </h1>
      <p
        className="mb-1 text-center text-sm font-medium"
        style={{ color: 'var(--sidebar-text)' }}
      >
        {profile.title}
      </p>
      <p
        className="mb-6 text-center text-xs"
        style={{ color: 'var(--sidebar-muted)' }}
      >
        {profile.subtitle}
      </p>
      <div
        className="mb-6 w-full"
        style={{ borderTop: '1px solid var(--kraft-dark)' }}
      />
      <div className="mb-6 flex w-full flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-4 shrink-0 justify-center" style={{ color: 'var(--sidebar-muted)' }}>@</span>
          <a
            href={`mailto:${profile.email}`}
            className="break-all underline-offset-2 hover:underline"
            style={{ color: 'var(--sidebar-text)' }}
          >
            {profile.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex w-4 shrink-0 justify-center" style={{ color: 'var(--sidebar-muted)' }}>&#9906;</span>
          <span style={{ color: 'var(--sidebar-text)' }}>
            {profile.location}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded px-3 py-1.5 text-center text-sm transition-colors"
            style={{
              backgroundColor: 'var(--sidebar-btn-bg)',
              color: 'var(--sidebar-btn-text)',
              border: '1px solid var(--border-warm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sidebar-btn-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sidebar-btn-bg)';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <ThemeToggle />
      </div>
    </aside>
  );
}
