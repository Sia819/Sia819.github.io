import { Education, Certification } from '@/types/resume';

interface EducationSectionProps {
  educations: Education[];
  certifications: Certification[];
  accentColor: string;
}

const EducationSection = ({ educations, certifications, accentColor }: EducationSectionProps) => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold" style={{ color: accentColor }}>
        학력 &amp; 자격증
      </h2>

      {/* 학력 */}
      <div className="mb-8 flex flex-col gap-4">
        {educations.map((edu, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 pl-6"
            style={{ borderLeft: '2px solid var(--border-warm)' }}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {edu.institution}
              </h3>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {edu.period}
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: accentColor }}>
              {edu.degree}
            </p>
            {edu.description && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 자격증 */}
      {certifications.length > 0 && (
        <div>
          <h3
            className="mb-3 text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Certifications
          </h3>
          <div className="flex flex-col gap-2">
            {certifications.map((cert, i) => (
              <div key={i} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="font-medium">{cert.name}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {cert.issuer} | {cert.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
