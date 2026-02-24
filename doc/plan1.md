# Plan 1 - Sia819.github.io 사이트 구축 계획

## 현재 완료된 것

### 인프라 (완료)
- [x] Next.js 16.1.6 + TypeScript + React 19 프로젝트 초기화
- [x] Tailwind CSS 4 설정
- [x] ESLint + Prettier 설정
- [x] GitHub Actions CI/CD (`deploy.yml`) - main push 시 자동 빌드/배포
- [x] `.gitignore` 설정 (out/, node_modules/, .next/ 등)
- [x] `CLAUDE.md` 프로젝트 규칙 정립
- [x] `README.md` 프로젝트 설명 (빌드/배포 방식 포함)
- [x] Hello World 페이지 (`src/app/page.tsx`)

### 현재 파일 구조
```
Sia819.github.io/
├── .github/workflows/deploy.yml   # CI/CD
├── src/
│   └── app/
│       ├── layout.tsx              # 루트 레이아웃 (lang="ko", Geist 폰트)
│       ├── page.tsx                # 메인 페이지 (현재 Coming Soon)
│       ├── globals.css             # Tailwind + 다크모드 기본 변수
│       └── favicon.ico
├── CLAUDE.md
├── README.md
├── next.config.ts                  # output: 'export' (정적 빌드)
├── package.json
├── tsconfig.json
└── ...
```

---

## 만들 것

### 1. 메인 페이지 - 이력서/포트폴리오 (최우선)

첫 화면이 이력서. 스크롤하면 A4 블록 단위로 섹션이 내려가는 구조.

#### 섹션 구성 (위에서 아래로 스크롤)
1. **히어로/프로필** - 이름, 직함, 한 줄 소개, 프로필 사진
2. **소개** - 간단한 자기소개 (2~3문단)
3. **기술 스택** - 사용 가능한 기술 목록 (카테고리별 정리)
4. **경력** - 회사명, 기간, 역할, 주요 업무 (타임라인 형태)
5. **프로젝트** - 주요 프로젝트 카드 (제목, 설명, 기술, 링크)
6. **학력/자격증** - 학력, 자격증 목록
7. **연락처/Footer** - 이메일, GitHub, LinkedIn 등 링크

#### 디자인 방향
- A4 용지 느낌의 블록이 수직으로 쌓이는 형태
- 깔끔하고 전문적인 톤 (개발자 이력서 느낌)
- 다크모드/라이트모드 지원
- 반응형 (모바일에서도 잘 보이게)

#### 데이터 관리
- 이력서 데이터는 별도 파일(JSON 또는 TS 상수)로 분리
- 내용을 수정할 때 데이터 파일만 고치면 되는 구조

### 2. 블로그 섹션 (이후 작업)

노션에서 작성한 글을 사이트에 표시.

#### 구조
```
[sia819.github.io (정적 사이트)]
        │
        │ fetch (클라이언트 사이드)
        ▼
[NAS 서버 - Notion API 중계 서버]
        │
        │ Notion API 호출
        ▼
[Notion 데이터베이스]
```

#### NAS 서버 역할
- Notion API 키를 안전하게 보관 (클라이언트에 노출 안 됨)
- Notion API를 호출해서 글 목록/내용을 JSON으로 반환
- CORS 설정으로 sia819.github.io에서만 접근 허용

#### 블로그 기능
- 글 목록 페이지 (`/blog`)
- 글 상세 페이지 (`/blog/[slug]`)
- 노션에서 글 작성 → NAS 서버가 중계 → 사이트에 표시
- 카테고리/태그 필터

### 3. 네비게이션

- 상단 고정 헤더 (스크롤 시에도 보임)
- 메뉴: Home(이력서) | Blog | (추후 확장 가능)

---

## 구현 순서

### Phase 1: 이력서 페이지 (지금 해야 할 것)
1. 이력서 데이터 구조 설계 (타입 정의 + 샘플 데이터)
2. A4 블록 레이아웃 컴포넌트
3. 각 섹션 컴포넌트 (프로필, 기술, 경력, 프로젝트, 학력)
4. 네비게이션 헤더
5. 반응형 + 다크모드

### Phase 2: 블로그 기초 (NAS 서버 없이)
1. `/blog` 라우트 추가
2. 블로그 목록/상세 페이지 레이아웃
3. 목업 데이터로 UI 먼저 구현

### Phase 3: 노션 연동 (NAS 서버 구축 후)
1. NAS에 Notion API 중계 서버 구축
2. 블로그 페이지에서 NAS API 호출 연동
3. 노션 블록 → HTML 렌더링

---

## 기술적 결정 사항

| 항목 | 결정 | 이유 |
|------|------|------|
| 프레임워크 | Next.js (static export) | GitHub Pages 호환, React 기반 |
| CSS | Tailwind CSS | 빠른 개발, 유틸리티 기반 |
| 라우팅 | Next.js App Router | 기본 내장, 파일 기반 라우팅 |
| 데이터 | TS 상수 파일 (이력서) / API fetch (블로그) | 이력서는 정적, 블로그는 동적 |
| 배포 | GitHub Actions → GitHub Pages | main push 시 자동 |
| 브랜치 | main(배포) + dev(개발) | 안전한 배포 |
| 언어 | 한국어 응답, 영어 코드 | CLAUDE.md 규칙 |
| 커밋 | Conventional Commits | 일관된 이력 관리 |

---

## 파일 구조 (목표)

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (헤더 포함)
│   ├── page.tsx            # 메인 = 이력서 페이지
│   ├── globals.css         # 글로벌 스타일
│   └── blog/               # (Phase 2)
│       ├── page.tsx        # 블로그 목록
│       └── [slug]/
│           └── page.tsx    # 블로그 상세
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # 네비게이션 헤더
│   │   └── Footer.tsx      # 푸터
│   └── sections/
│       ├── HeroSection.tsx       # 프로필/히어로
│       ├── AboutSection.tsx      # 소개
│       ├── SkillsSection.tsx     # 기술 스택
│       ├── CareerSection.tsx     # 경력
│       ├── ProjectsSection.tsx   # 프로젝트
│       └── EducationSection.tsx  # 학력/자격증
├── data/
│   └── resume.ts           # 이력서 데이터 (JSON-like 상수)
├── types/
│   └── resume.ts           # 이력서 타입 정의
└── lib/
    └── api.ts              # (Phase 3) NAS API 호출 함수
```
