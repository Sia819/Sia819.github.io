import { Profile } from '@/types/resume';

interface HeroSectionProps {
  profile: Profile;
}

const HeroSection = ({ profile }: HeroSectionProps) => {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      {/* 프로필 아바타 플레이스홀더 */}
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-200 text-4xl font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300">
        {profile.name.charAt(0)}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
          {profile.title}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400">
          {profile.subtitle}
        </p>
      </div>

      {/* 연락처 정보 */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            {profile.email}
          </a>
        )}
        {profile.location && <span>{profile.location}</span>}
      </div>

      {/* 소셜 링크 */}
      <div className="flex gap-3">
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
