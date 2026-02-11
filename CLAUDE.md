# CLAUDE.md - Sia819.github.io

## 프로젝트 개요

Sia819의 개인 포트폴리오 + 블로그 사이트. GitHub Pages로 정적 배포된다.

## 기술 스택

- **프레임워크**: Next.js (Static Export)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **패키지 매니저**: npm
- **코드 품질**: ESLint + Prettier
- **CI/CD**: GitHub Actions → GitHub Pages

## 프로젝트 구조

```
src/
├── app/           # Next.js App Router 페이지
├── components/    # 재사용 가능한 UI 컴포넌트
│   ├── common/    # 범용 컴포넌트 (Button, Modal 등)
│   ├── layout/    # 레이아웃 관련 (Header, Footer, Sidebar)
│   └── sections/  # 페이지 섹션 컴포넌트
├── lib/           # 유틸리티 함수, 헬퍼
├── types/         # TypeScript 타입 정의
└── styles/        # 글로벌 스타일
public/            # 정적 자산 (이미지, 폰트 등)
content/           # 블로그 포스트 (Markdown/MDX)
```

## 코딩 컨벤션

### 언어 규칙

- 응답, 주석 설명: **한국어**
- 변수명, 함수명, 커밋 메시지, 코드 주석: **영어**

### 네이밍

- 컴포넌트: PascalCase (`PostCard.tsx`)
- 함수/변수: camelCase (`getUserName`)
- 상수: UPPER_SNAKE_CASE (`MAX_POSTS_PER_PAGE`)
- 파일명: 컴포넌트는 PascalCase, 그 외는 kebab-case
- CSS 클래스: Tailwind 유틸리티 클래스 사용 (커스텀 클래스는 kebab-case)

### 컴포넌트 패턴

- 함수형 컴포넌트 + Arrow Function 사용
- Props 타입은 컴포넌트 파일 상단에 interface로 정의
- `'use client'`는 필요한 경우에만 사용 (기본은 Server Component)

### 임포트 순서

1. React/Next.js 내장 모듈
2. 외부 라이브러리
3. 내부 모듈 (`@/` alias)
4. 타입 임포트

## 커밋 메시지 규칙

Conventional Commits 형식을 따른다:

```
<type>: <description>

[optional body]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 타입

- `feat`: 새 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포매팅 (동작 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 등 기타 변경
- `content`: 블로그 포스트 등 콘텐츠 추가/수정

## 브랜치 전략

- `main`: 배포 브랜치 (직접 커밋 금지, PR로만 merge)
- `dev`: 개발 브랜치 (기본 작업 브랜치)
- 기능 브랜치: `feat/<feature-name>`, `fix/<bug-name>` 등 dev에서 분기

## 빌드 & 배포

```bash
npm run build    # next build (static export → out/)
npm run dev      # 로컬 개발 서버
npm run lint     # ESLint 실행
npm run format   # Prettier 포매팅
```

- `main` 브랜치에 push/merge 시 GitHub Actions가 자동으로 빌드 & GitHub Pages 배포
- `next.config.ts`에서 `output: 'export'` 설정 필수

## 작업 시 주의사항

- 기존 파일을 수정할 때는 반드시 먼저 Read로 읽어본 후 변경
- 불필요한 파일 생성 최소화
- 보안에 민감한 정보(.env, 키 등)는 절대 커밋하지 않음
- 과도한 엔지니어링 지양: 현재 필요한 만큼만 구현
