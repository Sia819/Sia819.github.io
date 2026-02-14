const TECH_STACK = [
  { name: 'Next.js', version: '16.1.6', url: 'https://nextjs.org', license: 'MIT' },
  { name: 'React', version: '19.2.3', url: 'https://react.dev', license: 'MIT' },
  { name: 'TypeScript', version: '5.x', url: 'https://www.typescriptlang.org', license: 'Apache-2.0' },
  { name: 'Tailwind CSS', version: '4.x', url: 'https://tailwindcss.com', license: 'MIT' },
];

const SettingsSection = () => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--tab-settings)' }}>
        Site Info
      </h2>

      {/* 사용 기술 */}
      <div className="mb-8">
        <h3
          className="mb-3 text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Tech Stack
        </h3>
        <div className="flex flex-col gap-2">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col gap-0.5 pl-4 sm:flex-row sm:items-center sm:gap-3"
              style={{ borderLeft: '2px solid var(--border-warm)' }}
            >
              <a
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline-offset-2 hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {tech.name}
              </a>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                v{tech.version} &middot; {tech.license}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 배포 */}
      <div className="mb-8">
        <h3
          className="mb-3 text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Deployment
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          GitHub Pages &middot; Static Export
        </p>
      </div>

      {/* 라이선스 */}
      <div>
        <h3
          className="mb-3 text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          License
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} Sia819. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SettingsSection;
