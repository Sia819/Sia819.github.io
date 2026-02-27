# 다크모드 적용 플랜 (next-themes 기반)

본 문서는 `next-themes` 패키지를 활용하여 프로젝트에 다크모드를 도입하기 위한 단계별 작업 계획입니다. 기존의 CSS 변수(`var(...)`) 기반 스타일링 구조를 유지하면서, 하드코딩된 색상들을 CSS 변수로 추출하고 다크 테마 팔레트를 적용합니다.

## Step 1. `next-themes` 설치 및 Provider 설정

1. **패키지 설치:** `npm install next-themes`
2. **Provider 분리 및 적용 (`src/components/providers/ThemeProvider.tsx` & `src/app/layout.tsx`):**
   - **중요:** Next.js App Router 환경에서는 `layout.tsx`가 서버 컴포넌트이므로, `next-themes`의 `ThemeProvider`는 `'use client'` 지시어가 포함된 별도의 클라이언트 컴포넌트(`ThemeProvider.tsx`)로 분리해서 감싸주어야 합니다.
   - `<body>` 태그 내부의 `children`을 만들어둔 `<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>`으로 감쌉니다.
   - <html> 태그에 `suppressHydrationWarning` 속성이 이미 있는지 확인하고 유지합니다.
   - `<meta name="darkreader-lock" />`: 기존에 설정된 Dark Reader 확장 프로그램 차단 메타 태그는 프로젝트의 네이티브 다크 모드가 우선적으로 동작하도록 유지합니다.

## Step 2. 전역 스타일 확장 및 다크 테마 변수 정의 (`src/app/globals.css`)

기존 `:root` 선택자에 컴포넌트들에서 하드코딩으로 사용 중인 색상들을 CSS 변수로 추가하고, `[data-theme="dark"]` 선택자를 통해 다크 테마용 색상 팔레트를 정의합니다. 테마 전환 시 부드러운 효과를 위해 `transition`도 추가합니다.

**추가할 CSS 변수 (라이트/다크 양쪽 정의):**
- **코드 블록 (`--code-*`):** `--code-bg`, `--code-text`, `--code-comment`, `--code-string`, `--code-punctuation`, `--code-number`, `--code-keyword`, `--code-function`, `--code-class`, `--code-builtin`
- **탭 텍스트 (`--tab-text-*`):** `--tab-text-active`, `--tab-text-inactive`
- **스크롤 힌트 (`--hint-*`):** `--hint-bg`, `--hint-text`, `--hint-border`
- **콜아웃 (`--callout-*`):** `--callout-note-bg`, `--callout-note-border`, `--callout-tip-bg`, `--callout-tip-border`, `--callout-warning-bg`, `--callout-warning-border`, `--callout-important-bg`, `--callout-important-border`
- **기타 마크다운 (`--hr-color`, `--blockquote-bg`)**
- **그림자 (`--shadow-notebook`, `--shadow-binder-pin`, `--shadow-tab`)**

**다크 테마 기본 변수 (`--paper`, `--kraft`, `--text-primary` 등) 재정의:**
- 기존 종이 질감을 유지하면서 따뜻한 어두운 톤(Dark Brown / Warm Gray 계열)으로 재정의합니다.

## Step 3. 하드코딩 색상 CSS 변수로 마이그레이션

각 컴포넌트에 하드코딩되어 있는 색상 값(HEX, RGBA 등)과 그림자를 Step 2에서 정의한 CSS 변수로 교체합니다.

- **`src/components/sections/markdown/CodeBlock.tsx`:** Prism 테마(`kraftTheme`)의 색상들을 `var(--code-*)`로 변경.
  *(**Fallback 전략**: `prism-react-renderer` 내부 로직에 의해 CSS 변수 파싱에 문제가 생길 경우, `useTheme` 훅으로 현재 테마를 읽어와 `lightTheme`과 `darkTheme` 객체를 분리하여 넘겨주는 방식으로 전환합니다.)*
- **`src/components/tabs/TabButton.tsx`:** 
  - 활성/비활성 탭 텍스트 색상을 `var(--tab-text-*)`로 변경
  - `boxShadow: isActive ? 'none' : '1px 1px 3px rgba(0,0,0,0.1)'` 부분의 하드코딩된 그림자 값을 `var(--shadow-tab)`으로 변경하여 다크모드에서는 어울리게 투명도를 조절.
- **`src/components/sections/markdown/Callout.tsx`:** `CALLOUT_CONFIG`의 배경, 테두리, 아이콘 색상을 `var(--callout-*)`로 변경
- **`src/components/sections/MarkdownSection.tsx`:** `<hr>` 테두리 색상 및 `<blockquote>` 배경색을 변수로 변경
- **`src/app/page.tsx`:** 노트북 및 바인더 핀의 `boxShadow` 값, 스크롤 힌트 팝업 색상을 변수로 변경
- **`src/content/1. home.tsx`:** 확인 결과 이미 `var(--kraft-dark)`, `var(--text-primary)` 등 기존 정의된 변수를 완벽하게 사용 중이므로 별도의 수정은 필요하지 않습니다.

## Step 4. ThemeToggle 컴포넌트 생성 (`src/components/common/ThemeToggle.tsx`)

- `next-themes`의 `useTheme` 훅을 사용하는 토글 버튼 컴포넌트를 생성합니다.
- 클라이언트 렌더링(Mounted 상태) 확인 후 렌더링하여 Hydration 에러를 방지합니다.
- 사용자가 직관적으로 인지할 수 있도록 해(Sun)/달(Moon) 아이콘 등을 활용하여 UI를 구성합니다. 스타일은 기존 사이드바 링크 버튼 등과 어울리도록 합니다.

## Step 5. ThemeToggle 배치 (`src/app/page.tsx`)

생성한 토글 컴포넌트를 적절한 위치에 배치합니다.
- **데스크탑:** 좌측 프로필 사이드바(`<aside>`) 하단 (링크 버튼 목록 아래 등)
- **모바일:** 상단 프로필 헤더(md:hidden div) 우측 또는 적절한 여백

## 검증 (Validation)

1. 로컬 개발 서버(`npm run dev`)에서 라이트/다크 모드 전환 시 FOUC(깜빡임) 없이 부드럽게 전환되는지 확인.
2. 시스템 설정(OS 테마) 변경 시 즉시 반영되는지 확인.
3. 각종 마크다운 요소(코드 블록, 콜아웃, 인용구 등)가 다크 테마에서 가독성 있게 렌더링되는지 확인.
4. 브라우저 새로고침 후에도 선택한 테마가 유지되는지 확인.