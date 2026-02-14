import { resumeData } from '@/data/resume';

interface HomeContentProps {
  accentColor: string;
}

const HomeContent = ({ accentColor }: HomeContentProps) => {
  const { profile } = resumeData;

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      {/* 책 표지 스타일 */}
      <div className="flex flex-col items-center gap-6">
        {/* 상단 장식선 */}
        <div
          className="h-[2px] w-32"
          style={{ backgroundColor: 'var(--kraft-dark)' }}
        />

        {/* 아바타 */}
        <img
          src="https://avatars.githubusercontent.com/u/18740181"
          alt={profile.name}
          className="h-32 w-32 rounded-full object-cover"
          style={{ border: '3px solid var(--kraft-dark)' }}
        />

        {/* 이름 */}
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          {profile.name}
        </h1>

        {/* 직함 */}
        <p
          className="text-lg font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.title}
        </p>

        {/* 부제 */}
        <p
          className="max-w-sm text-sm leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          {profile.subtitle}
        </p>

        {/* 하단 장식선 */}
        <div
          className="h-[2px] w-32"
          style={{ backgroundColor: 'var(--kraft-dark)' }}
        />

        {/* 연락처 & 링크 */}
        <div className="mt-2 flex flex-col items-center gap-2 text-sm">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile.email}
            </a>
          )}
          <div className="flex gap-4">
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
