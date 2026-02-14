import { SkillCategory } from '@/types/resume';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--tab-skills)' }}>
        기술 스택
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {skills.map((category) => (
          <div key={category.category}>
            <h3
              className="mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md px-3 py-1 text-sm"
                  style={{
                    backgroundColor: 'var(--kraft-light)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
