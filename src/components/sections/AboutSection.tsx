interface AboutSectionProps {
  paragraphs: string[];
  accentColor: string;
}

const AboutSection = ({ paragraphs, accentColor }: AboutSectionProps) => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold" style={{ color: accentColor }}>
        자기소개
      </h2>
      <div className="flex flex-col gap-4">
        {paragraphs.map((text, i) => (
          <p key={i} className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
