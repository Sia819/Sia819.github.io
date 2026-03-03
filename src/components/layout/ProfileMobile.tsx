import ThemeToggle from '@/components/common/ThemeToggle';
import { profile } from '@/data/profile';

export default function MobileProfile() {
  return (
    <div
      className="sidebar-texture flex items-center justify-between px-5 py-4 md:hidden"
      style={{ backgroundColor: 'var(--kraft)' }}
    >
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {profile.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {profile.title}
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}
