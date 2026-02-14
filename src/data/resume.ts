import { ResumeData } from '@/types/resume';

export const resumeData: ResumeData = {
  profile: {
    name: 'Sia819',
    title: 'Software Developer',
    subtitle: '효율적이고 유지보수 가능한 코드를 지향하는 개발자',
    email: 'lunasia819@gmail.com',
    location: 'Seoul, South Korea',
    links: [
      { label: 'GitHub', url: 'https://github.com/Sia819' },
      { label: 'Blog', url: 'https://sia819.github.io' },
    ],
  },

  about: [
    '안녕하세요. 소프트웨어 개발에 열정을 가진 개발자입니다. 깔끔한 코드와 효율적인 시스템 설계에 관심이 많으며, 새로운 기술을 배우고 적용하는 것을 즐깁니다.',
    '다양한 프로젝트 경험을 통해 풀스택 개발 역량을 쌓아왔으며, 특히 웹 프론트엔드와 시스템 프로그래밍에 강점을 가지고 있습니다.',
  ],

  skills: [
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Express', 'Python', 'REST API'],
    },
    {
      category: 'DevOps & Tools',
      skills: ['Git', 'GitHub Actions', 'Docker', 'Linux'],
    },
    {
      category: 'Language',
      skills: ['TypeScript', 'JavaScript', 'Python', 'C#', 'C++'],
    },
  ],

  careers: [
    {
      company: 'Company Name',
      position: 'Software Developer',
      period: '2023.01 - Present',
      description: '웹 서비스 개발 및 유지보수',
      achievements: [
        '주요 서비스 프론트엔드 리뉴얼 프로젝트 리드',
        'CI/CD 파이프라인 구축으로 배포 시간 50% 단축',
        '코드 리뷰 문화 도입 및 팀 개발 프로세스 개선',
      ],
    },
    {
      company: 'Previous Company',
      position: 'Junior Developer',
      period: '2021.03 - 2022.12',
      description: '백엔드 API 개발 및 DB 설계',
      achievements: [
        'RESTful API 설계 및 구현 (월 100만 요청 처리)',
        '데이터베이스 쿼리 최적화로 응답 속도 30% 향상',
      ],
    },
  ],

  projects: [
    {
      title: 'Portfolio & Blog',
      description:
        'Next.js 기반 개인 포트폴리오 및 블로그 사이트. GitHub Pages로 정적 배포.',
      techs: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GitHub Actions'],
      link: 'https://sia819.github.io',
    },
    {
      title: 'Project Alpha',
      description:
        '실시간 데이터 대시보드 프로젝트. WebSocket 기반 실시간 차트 및 알림 시스템.',
      techs: ['React', 'Node.js', 'WebSocket', 'D3.js'],
      link: 'https://github.com/Sia819',
    },
    {
      title: 'Project Beta',
      description:
        'CLI 기반 자동화 도구. 반복 작업을 스크립트로 자동화하여 생산성 향상.',
      techs: ['Python', 'Click', 'Docker'],
    },
  ],

  educations: [
    {
      institution: 'University Name',
      degree: '컴퓨터공학과 학사',
      period: '2017.03 - 2023.02',
      description: '소프트웨어 엔지니어링, 알고리즘, 데이터베이스 전공',
    },
  ],

  certifications: [
    {
      name: '정보처리기사',
      issuer: '한국산업인력공단',
      date: '2024.06',
    },
  ],
};
