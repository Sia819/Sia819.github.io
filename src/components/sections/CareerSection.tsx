import { Career } from '@/types/resume';

interface CareerSectionProps {
  careers: Career[];
}

const CareerSection = ({ careers }: CareerSectionProps) => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--tab-career)' }}>
        경력
      </h2>
      <div className="flex flex-col gap-8">
        {careers.map((career, i) => (
          <div
            key={i}
            className="relative pl-6"
            style={{ borderLeft: '2px solid var(--border-warm)' }}
          >
            {/* 타임라인 도트 */}
            <div
              className="absolute -left-[7px] top-1 h-3 w-3 rounded-full"
              style={{ backgroundColor: 'var(--tab-career)' }}
            />

            <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {career.company}
                </h3>
                <p className="text-sm font-medium" style={{ color: 'var(--tab-career)' }}>
                  {career.position}
                </p>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {career.period}
              </span>
            </div>

            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {career.description}
            </p>

            <ul className="flex flex-col gap-1.5">
              {career.achievements.map((item, j) => (
                <li
                  key={j}
                  className="text-sm before:mr-2 before:content-['•']"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerSection;
