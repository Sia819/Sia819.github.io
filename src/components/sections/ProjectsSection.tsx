import { Project } from '@/types/resume';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold" style={{ color: 'var(--tab-projects)' }}>
        포트폴리오
      </h2>
      <div className="flex flex-col gap-5">
        {projects.map((project, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-lg p-5"
            style={{
              border: '1px solid var(--border-warm)',
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {project.title}
              </h3>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                  style={{ color: 'var(--tab-projects)' }}
                >
                  Link
                </a>
              )}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.techs.map((tech) => (
                <span
                  key={tech}
                  className="rounded px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: 'rgba(196, 149, 32, 0.15)',
                    color: 'var(--tab-projects)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
