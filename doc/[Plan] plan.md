# 포트폴리오 사이트 아키텍처 개선 계획 (SPA → SSG 기반 유니버설 렌더링)

## 1. 현재 구조의 문제점 (SPA & Hash Routing)
*   **구조:** 하나의 주소(`/`)에서 모든 상태(`activeTab`)를 자바스크립트로 관리하며 탭 내용만 화면에서 교체하는 완벽한 SPA(Single Page Application) 형태.
*   **문제점:** AI 크롤러나 검색 엔진 봇(Bot)은 자바스크립트를 완벽하게 실행하거나 탭을 클릭하지 못함. 결과적으로 처음 접속 시 보여지는 '홈' 탭의 내용만 수집하고, 다른 탭(이력서, 자기소개 등)의 내용은 누락됨.
*   **배포 환경 특성:** 현재 GitHub Pages(`output: 'export'`)를 사용 중이므로, 서버 사이드 로직이 불가능한 정적 호스팅 환경임. 루트 도메인(`sia819.github.io`)으로 배포하므로 `basePath` 설정은 불필요.

## 2. 목표 구조: SSG 기반 Isomorphic App
*   **목표:** 각 탭이 고유한 URL 경로(예: `/resume`, `/introduction`)를 갖도록 설계하여 **정적 호스팅의 한계를 극복**하고 **SEO 이점**과 **SPA의 부드러운 UX**를 모두 취하는 것.
*   **핵심 기술 (Next.js 정적 Export 기반):**
    1.  **빌드 타임 SSG (Static Site Generation):** `next build` 시점에 모든 탭 경로(`/resume/index.html` 등)를 개별 HTML 파일로 미리 생성함. 크롤러는 각 주소 방문 시 해당 페이지의 완성된 HTML을 즉시 읽을 수 있음.
    2.  **Hydration (SPA 전환):** 첫 HTML 로드 후 자바스크립트가 앱의 통제권을 가져와 이후의 전환을 SPA 방식으로 처리함.
    3.  **선택적 프리패칭:** `<Link prefetch={false}>` 기본 + 현재 탭의 인접(이전/다음) 탭만 선택적으로 프리패치하여 네트워크 부하 최소화.

## 3. 리팩토링 단계 (Action Plan)

```
단계 0 → 단계 1 → 단계 2 → ┬→ 단계 3 ─┬→ 단계 5
                            └→ 단계 4 ─┘
```

### 리스크 매트릭스

| 단계 | 위험도 | 핵심 리스크 |
|------|--------|-------------|
| 0 | 낮음 | 설정 변경만, 부작용 적음 |
| 1 | **높음** | 상태 관리 재설계 필요, 범위가 과소평가되기 쉬움 |
| 2 | 중간 | 콘텐츠 번들 분리 미흡 시 성능 저하 |
| 3 | 중간 | 프리패치 전략, useHashSync 재설계, 메타데이터 |
| 4 | **높음** | `router.push` 기반 전환 시 UX 저하 가능성 |
| 5 | 중간 | App Router 전환 애니메이션 기술적 제약 |

---

### 단계 0: 설정 및 파이프라인 보완 (위험도: 낮음)
*   **`next.config.ts` 수정:** `trailingSlash: true` 설정 추가. GitHub Pages에서 `/resume` 접속 시 `/resume/index.html`을 정상적으로 서빙하기 위함.
*   **`app/not-found.tsx` 추가:** 커스텀 404 페이지를 만들어 잘못된 URL 접근 시 홈으로 안내. Next.js static export가 `404.html`을 자동 생성하도록 함.

### 단계 1: 레이아웃 및 상태 구조 분리 (위험도: 높음)

**핵심 문제:** 현재 `page.tsx`가 `'use client'`이며, `useTabWheel`이 반환하는 `activeTab`, `contentRef`, `handleOuterWheel` 등의 상태/핸들러가 노트북 껍데기(사이드바, 바인더, 탭스트립)와 콘텐츠 영역 양쪽 모두에 걸쳐 사용됨. 단순히 "UI를 layout으로 이동"하는 것이 아니라 **상태 관리 아키텍처의 재설계**가 필요.

*   **`layout.tsx` 역할 한정:** 메타데이터 + 폰트 + `ThemeProvider`만 유지 (Server Component).
*   **`NotebookShell.tsx` Client Component 신설:** 노트북 껍데기 전체(프로필 사이드바, 바인더, 탭스트립, 콘텐츠 래퍼)를 담는 Client Component. `layout.tsx`에서 `children`을 받아 `<NotebookShell>{children}</NotebookShell>` 형태로 감쌈.
*   **상태 분리 설계:**
    - 탭 목록/현재 탭 판별: `usePathname()` 기반 (URL이 곧 상태)
    - 휠/키보드 네비게이션: `NotebookShell` 내에서 `router` 연동
    - `contentRef`: `NotebookShell`에서 `children`을 감싸는 스크롤 컨테이너에 부착

### 단계 2: 페이지 분리 및 콘텐츠 번들 최적화 (위험도: 중간)
*   **`src/app/page.tsx`:** 홈(`home`) 전용 페이지.
*   **`src/app/[tabId]/page.tsx`:** `generateStaticParams`를 사용해 모든 탭 경로를 정적 HTML로 생성 (about 탭 포함).
*   **`generateMetadata` 추가:** `[tabId]/page.tsx`에서 탭별 고유한 `title`, `description`, OG 태그를 동적 생성. 이것이 없으면 SSG의 SEO 이점이 반감됨.
*   **콘텐츠 번들 분리 (필수):** 현재 `generated/content.ts`가 모든 마크다운을 하나의 파일에 import하므로, `raw-loader` 문자열은 tree-shaking 불가 → 모든 페이지 번들에 전체 콘텐츠 포함됨.
    - **방법:** `generate-content-index.mjs`를 수정하여 탭별 개별 파일 생성 (`generated/tab-resume.ts`, `generated/tab-career.ts` 등). 각 `[tabId]/page.tsx`에서 해당 파일만 import.
    - **탭 정의(메타 정보)와 콘텐츠(본문)를 분리:** `generated/tab-defs.ts` (탭 ID, 라벨, 색상 목록)는 공유, 본문은 페이지별 개별 import.

### 단계 3: URL 기반 라우팅 및 앵커 지원 (위험도: 중간 / 단계 2 이후, 단계 4와 병렬 가능)
*   **탭 버튼 교체:** `<button>` → `<Link href="/[tabId]" prefetch={false}>`. 모든 탭이 항상 뷰포트에 노출되므로, 기본 프리패치를 끄지 않으면 페이지 로드 시 모든 탭의 JS 번들을 동시에 요청하게 됨.
*   **선택적 프리패칭:** 현재 탭의 이전/다음 탭만 프로그래밍 방식으로 `router.prefetch('/nextTab')`를 호출. 휠 기반 순차 탐색이 주 패턴이므로 인접 탭만 프리패치하면 충분.
*   **`useHashSync` → `useHeadingTracker`로 재설계:**
    - 탭 동기화 로직 **전면 제거** (URL 경로가 탭을 결정).
    - `IntersectionObserver` 기반 heading 추적만 보존, 라우트 전환 시 Observer **재등록** 처리.
    - URL 형식: `/resume#section-1` (pathname = 탭, hash = 섹션).
    - `pathname` 변경 감지 시 Observer cleanup → 새 heading 등록.

### 단계 4: 마우스 휠 및 네비게이션 연동 (위험도: 높음 / 단계 2 이후, 단계 3과 병렬 가능)

**핵심 문제:** 현재 `setState` 기반 탭 전환은 ~16ms 내 즉시 리렌더. `router.push()`는 히스토리 업데이트 + 페이지 컴포넌트 로드 + 렌더링 오버헤드로 체감 지연 발생 가능. 빠른 연속 휠 시 지연 누적.

*   **하이브리드 접근 검토:**
    - **방안 A (표준):** `router.push()`로 전환 + 프리패칭으로 지연 최소화. 구현 단순하지만 UX 저하 가능성.
    - **방안 B (하이브리드):** 탭 전환은 클라이언트 상태(`useState`)로 즉시 처리하여 콘텐츠를 바로 교체하고, URL만 `window.history.replaceState()`로 동기화. SSG의 "각 URL에 완성된 HTML" 이점은 유지하면서 전환 UX도 보존. 단, 콘텐츠 로딩 로직이 복잡해짐.
    - **결정 기준:** 방안 A로 먼저 구현 후 체감 성능 측정 → 불만족 시 방안 B로 전환.
*   정적 환경에서의 프리패칭 성능 확인 및 최적화.

### 단계 5: 전환 효과 및 정리 (위험도: 중간 / 단계 3, 4 완료 후)

**기술적 제약:**
- `framer-motion`의 `AnimatePresence`: App Router에서 라우트 변경 시 이전 컴포넌트가 즉시 언마운트되어 exit 애니메이션 미작동 (근본 한계).
- `ViewTransition` API: Chrome 기반에서만 안정, Safari/Firefox 지원 불완전.

*   **현실적 전략:** 초기 구현은 **단순 fade/crossfade 전환**으로 시작. `NotebookShell` 내에서 `children`을 감싸는 래퍼에 `pathname`을 `key`로 사용하여 CSS transition 적용.
*   **후속 개선:** Next.js의 `startViewTransition` 통합 또는 `next-view-transitions` 라이브러리를 점진적으로 도입. 노트북 넘기기 애니메이션은 별도 후속 작업으로 분리.
*   **잔재 코드 정리:** `display: none` 전체 렌더링 로직 제거. 해당 경로에 맞는 하나의 콘텐츠 컴포넌트만 렌더링.

## 4. 기대 효과 및 고려사항
*   **완벽한 SEO:** 각 페이지가 독립된 HTML + 고유 메타데이터(`generateMetadata`)로 존재하여 크롤러가 전체 내용을 색인할 수 있음.
*   **고유 URL 제공:** 특정 탭을 `/resume`, `/introduction` 같은 깔끔한 URL로 공유 가능. 문서 내 섹션은 `/resume#section-1`로 직접 링크 가능.
*   **GitHub Pages 호환:** `trailingSlash: true` + `generateStaticParams`로 모든 경로 정적 HTML 생성. 커스텀 `404.html`로 잘못된 URL도 처리.
*   **콘텐츠 분리:** 탭별 개별 번들로 필요한 페이지의 데이터만 로드, 초기 로딩 성능 최적화.
*   **주의:** GitHub Pages는 실제 서버가 없으므로 모든 "서버 응답"은 빌드된 정적 파일의 서빙임.
