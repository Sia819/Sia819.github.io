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
    3.  **프리패칭 (Prefetching):** `<Link>` 컴포넌트를 통해 인접 페이지 데이터를 미리 로드하여 휠 전환 시 대기 시간을 최소화함.

## 3. 리팩토링 단계 (Action Plan)

```
단계 0 → 단계 1 → 단계 2 → ┬→ 단계 3 ─┬→ 단계 5
                            └→ 단계 4 ─┘
```

### 단계 0: 설정 및 파이프라인 보완
*   **`next.config.ts` 수정:** `trailingSlash: true` 설정을 추가하여 GitHub Pages에서 `/resume` 접속 시 `/resume/index.html`을 정상적으로 찾아갈 수 있도록 함.
*   **`generate-content-index.mjs` 수정:** 현재 모든 콘텐츠를 하나의 파일에 import하는 방식에서, 각 페이지가 자신의 콘텐츠만 개별적으로 가져올 수 있도록 구조 개선 (번들 크기 최적화).

### 단계 1: 공통 레이아웃 분리 (`app/layout.tsx`)
*   `page.tsx`의 전체 껍데기 UI(노트북 스프링, 사이드바, 탭 스트립 등)를 `layout.tsx`로 이동.
*   가운데 종이 영역만 `children`으로 렌더링하도록 구조화.

### 단계 2: 페이지 분리 및 동적 라우팅 설정 (`app/[tabId]/page.tsx`)
*   `src/app/page.tsx`: 홈(`home`) 전용 페이지.
*   `src/app/[tabId]/page.tsx`: `generateStaticParams`를 사용해 모든 탭 경로를 정적 HTML로 생성. (about 탭 포함)

### 단계 3: URL 기반 라우팅 및 앵커 지원 (단계 2 이후, 단계 4와 병렬 가능)
*   **탭 버튼 교체:** `<button>` → `<Link href="/[tabId]">`.
*   **해시 → 앵커 스크롤로 간소화:** 탭 전환은 URL 경로(`/resume`)로 처리하고, 문서 내 특정 섹션 이동은 `/resume#section-1` 형태의 해시 앵커로 유지. 기존 `useHashSync`의 탭 동기화 로직은 제거하되, `IntersectionObserver` 기반 heading 추적은 간소화하여 보존.

### 단계 4: 마우스 휠 및 네비게이션 연동 (단계 2 이후, 단계 3과 병렬 가능)
*   `useTabWheel` 수정: `setActiveTab` 대신 `router.push()` 호출.
*   정적 환경에서의 프리패칭 성능 확인 및 최적화.

### 단계 5: 페이지 전환 애니메이션 및 정리 (단계 3, 4 완료 후)
*   **전환 애니메이션 전략 결정:** 라우팅 기반 페이지 전환 시 기존 노트북 넘기기 UX를 유지하기 위한 방법 선택. 후보: CSS `ViewTransition` API (브라우저 네이티브, 경량) 또는 `framer-motion`의 `AnimatePresence` (세밀한 제어 가능, 번들 추가).
*   **잔재 코드 정리:** `display: none` 전체 렌더링 로직 제거. 해당 경로에 맞는 하나의 콘텐츠 컴포넌트만 렌더링하도록 롤백.

## 4. 기대 효과 및 고려사항
*   **완벽한 SEO:** 각 페이지가 독립된 HTML로 존재하여 크롤러가 전체 내용을 색인할 수 있음.
*   **고유 URL 제공:** 특정 탭을 `/resume`, `/introduction` 같은 깔끔한 URL로 공유 가능. 문서 내 섹션은 `/resume#section-1`로 직접 링크 가능.
*   **GitHub Pages 404 해결:** `trailingSlash: true` + `generateStaticParams`를 통해 모든 경로에 대한 정적 HTML이 생성되므로, 주소 직접 입력 시에도 정상 작동.
*   **콘텐츠 분리:** 필요한 페이지의 데이터만 로드하여 초기 로딩 성능 최적화.
*   **주의:** GitHub Pages는 실제 서버가 없으므로 모든 "서버 응답"은 빌드된 정적 파일의 서빙임.
