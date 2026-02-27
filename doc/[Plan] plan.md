# 포트폴리오 사이트 아키텍처 개선 계획 (SPA → SSG 기반 유니버설 렌더링)

## 1. 현재 구조의 문제점 (SPA & Hash Routing)
*   **구조:** 하나의 주소(`/`)에서 모든 상태(`activeTab`)를 자바스크립트로 관리하며 탭 내용만 화면에서 교체하는 완벽한 SPA(Single Page Application) 형태. 모든 탭 콘텐츠를 동시에 렌더링하고 `display: isActive ? 'block' : 'none'`으로 숨기는 패턴 사용 중.
*   **문제점:** AI 크롤러나 검색 엔진 봇(Bot)은 자바스크립트를 완벽하게 실행하거나 탭을 클릭하지 못함. 결과적으로 처음 접속 시 보여지는 '홈' 탭의 내용만 수집하고, 다른 탭(이력서, 자기소개 등)의 내용은 누락됨.
*   **배포 환경 특성:** 현재 GitHub Pages(`output: 'export'`)를 사용 중이므로, 서버 사이드 로직이 불가능한 정적 호스팅 환경임. 루트 도메인(`sia819.github.io`)으로 배포하므로 `basePath` 설정은 불필요.

### 현재 상태 관리 구조 (변경 대상)
```
useTabWheel (activeTab, setActiveTab, contentRef, handleOuterWheel, handleContentWheel)
    ↕ 양방향 바인딩
useHashSync (hash ↔ activeTab 동기화, IntersectionObserver heading 추적)
```
- `page.tsx`가 `'use client'`이며, 위 두 훅의 상태/핸들러가 노트북 껍데기(사이드바, 바인더, 탭스트립)와 콘텐츠 영역 양쪽에 걸쳐 사용됨.
- `HOME_TAB`, `ABOUT_TAB`이 `TabButton.tsx`에 하드코딩되어 `CONTENT_TAB_DEFS`에서 제외된 별도 처리 구조.

## 2. 목표 구조: SSG 기반 Isomorphic App
*   **목표:** 각 탭이 고유한 URL 경로(예: `/resume`, `/introduction`)를 갖도록 설계하여 **정적 호스팅의 한계를 극복**하고 **SEO 이점**과 **SPA의 부드러운 UX**를 모두 취하는 것.
*   **핵심 기술 (Next.js 정적 Export 기반):**
    1.  **빌드 타임 SSG (Static Site Generation):** `next build` 시점에 모든 탭 경로(`/resume/index.html` 등)를 개별 HTML 파일로 미리 생성함. 크롤러는 각 주소 방문 시 해당 페이지의 완성된 HTML을 즉시 읽을 수 있음.
    2.  **Hydration (SPA 전환):** 첫 HTML 로드 후 자바스크립트가 앱의 통제권을 가져와 이후의 전환을 SPA 방식으로 처리함.
    3.  **선택적 프리패칭:** `<Link prefetch={false}>` 기본 + 현재 탭의 인접(이전/다음) 탭만 선택적으로 프리패치하여 네트워크 부하 최소화.

### 선결 설계 결정: 탭 전환 방식 (방안 A vs B)

> **이 결정이 단계 1~3의 아키텍처에 역으로 영향을 미치므로, 구현 착수 전 확정 필수.**

| | 방안 A (표준 라우팅) | 방안 B (하이브리드) |
|---|---|---|
| **전환 방식** | `router.push()`로 App Router 라우트 전환 | `useState`로 즉시 전환 + `history.replaceState()`로 URL 동기화 |
| **UX** | 프리패칭으로 지연 최소화하나, 빠른 연속 휠 시 지연 누적 가능 | 현재 SPA와 동일한 즉시 전환 UX 유지 |
| **번들 분리** | 페이지별 자동 코드 분할 (App Router 기본 동작) | 클라이언트에서 모든 탭 콘텐츠 필요 → `dynamic import`로 lazy-load 필요 |
| **구현 복잡도** | 낮음 (Next.js 표준 패턴) | 높음 (콘텐츠 로딩 + URL 동기화 + SSG HTML 매칭 로직) |
| **SSG 이점** | 완전히 활용 | HTML은 생성되지만, 클라이언트 전환은 SSG와 무관 |
| **상태 관리** | `usePathname()` 단일 소스 | `useState` + `usePathname()` 이중 소스 (동기화 필요) |

**권장:** 방안 A를 기본으로 확정. 프리패칭(인접 탭)으로 체감 지연을 최소화하고, 이것으로 부족할 경우에만 방안 B를 검토. 단, **방안 B로 전환 시 단계 1~3의 재작업이 상당하므로**, 방안 A의 성능이 수용 가능한 수준인지 단계 2 완료 시점에서 조기 검증.

## 3. 리팩토링 단계 (Action Plan)

```
단계 0 → 단계 1 → 단계 2 → [성능 검증] → ┬→ 단계 3 ─┬→ 단계 5 → 단계 6
                                            └→ 단계 4 ─┘
```

### 리스크 매트릭스

| 단계 | 위험도 | 핵심 리스크 |
|------|--------|-------------|
| 0 | 낮음 | 설정 변경만, 부작용 적음 |
| 1 | **높음** | 상태 관리 재설계 필요, `display: none` 패턴 제거 시점 결정, `useTabWheel` 리팩토링 범위 |
| 2 | 중간 | 콘텐츠 번들 분리 미흡 시 성능 저하, `home.tsx` 컴포넌트 타입 탭의 dynamic import 처리 |
| 3 | 중간 | 프리패치 전략, `useHeadingTracker` Observer 재등록 타이밍, 메타데이터 |
| 4 | **높음** | `router.push` 기반 전환 시 UX 저하 가능성, 스크롤 위치 복원 |
| 5 | 중간 | App Router 전환 애니메이션 기술적 제약, fade-out 불가 |
| 6 | 낮음 | 잔재 코드 제거, 레거시 해시 URL 리다이렉트 |

---

### 단계 0: 설정 및 파이프라인 보완 (위험도: 낮음)
*   **`next.config.ts` 수정:** `trailingSlash: true` 설정 추가. GitHub Pages에서 `/resume` 접속 시 `/resume/index.html`을 정상적으로 서빙하기 위함.
*   **`app/not-found.tsx` 추가:** 커스텀 404 페이지를 만들어 잘못된 URL 접근 시 홈으로 안내. Next.js static export가 `404.html`을 자동 생성하도록 함.
*   **검증:** 빌드 후 `out/` 디렉토리에 `404.html`이 정상 생성되는지 확인.

### 단계 1: 레이아웃 및 상태 구조 분리 (위험도: 높음)

**핵심 문제:** 현재 `page.tsx`가 `'use client'`이며, `useTabWheel`이 반환하는 `activeTab`, `contentRef`, `handleOuterWheel` 등의 상태/핸들러가 노트북 껍데기(사이드바, 바인더, 탭스트립)와 콘텐츠 영역 양쪽 모두에 걸쳐 사용됨. 단순히 "UI를 layout으로 이동"하는 것이 아니라 **상태 관리 아키텍처의 재설계**가 필요.

*   **`layout.tsx` 역할 한정:** 메타데이터 + 폰트 + `ThemeProvider`만 유지 (Server Component).
*   **`NotebookShell.tsx` Client Component 신설:** 노트북 껍데기 전체(프로필 사이드바, 바인더, 탭스트립, 콘텐츠 래퍼)를 담는 Client Component. `layout.tsx`에서 `children`을 받아 `<NotebookShell>{children}</NotebookShell>` 형태로 감쌈.
*   **상태 분리 설계:**
    - 탭 목록/현재 탭 판별: `usePathname()` 기반 (URL이 곧 상태)
    - 휠/키보드 네비게이션: `NotebookShell` 내에서 `router` 연동
    - `contentRef`: `NotebookShell`에서 `children`을 감싸는 스크롤 컨테이너에 부착

#### 1-A: `display: none` 패턴 제거 (이 단계에서 수행)

> 기존 계획에서는 단계 5로 미뤄져 있었으나, `NotebookShell`이 `children`(= 단일 페이지 콘텐츠)만 받는 구조이므로 **이 단계에서 `display: none` 전체 렌더링 패턴을 제거**해야 함. 단계 5까지 미루면 단계 2~4에서 구 패턴(모든 탭 동시 렌더링)과 신 패턴(경로별 단일 페이지)이 공존하여 혼란.

#### 1-B: `useTabWheel` 리팩토링 → `useTabNavigation`

현재 `useTabWheel`은 `activeTab`을 `useState`로 관리하며 `setActiveTab`을 반환. 이를 다음과 같이 분리:

```
[기존] useTabWheel → activeTab (useState), setActiveTab, contentRef, handlers
[변경] useTabNavigation → currentTab (usePathname 기반), navigateTab (router.push), contentRef, handlers
```

- `navigateTab(tabId)`: `router.push('/' + tabId)` 호출 (home일 경우 `router.push('/')`)
- 스크롤 경계 감지 로직: `contentRef` 기반으로 유지
- 휠/키보드 핸들러: 탭 전환 시 `navigateTab` 호출

#### 1-C: 라우트 전환 시 스크롤 위치 초기화

현재는 `activeTab` 변경 시 `contentRef.current.scrollTop = 0`을 수동 호출. App Router 전환 시에도 동일 동작이 필요:

- `NotebookShell` 내부에서 `usePathname()` 변경 감지 → `contentRef.current.scrollTop = 0` 실행
- 스크롤 컨테이너 DOM은 `NotebookShell`에 속하므로 라우트 전환과 무관하게 유지됨

### 단계 2: 페이지 분리 및 콘텐츠 번들 최적화 (위험도: 중간)

#### 2-A: 페이지 라우트 구조
*   **`src/app/page.tsx`:** 홈(`home`) 전용 페이지.
*   **`src/app/[tabId]/page.tsx`:** `generateStaticParams`를 사용해 모든 탭 경로를 정적 HTML로 생성 (about 탭 포함).

#### 2-B: `home` 탭과 `/` 경로 처리

> **주의:** `/` 경로와 `/home` 경로가 별도로 존재하게 되는 문제.

- `generateStaticParams`에서 `home`을 **제외** (루트 `/`가 home을 담당)
- `/home` 접근 시 처리: `[tabId]/page.tsx`에서 `tabId === 'home'`이면 `redirect('/')`로 리다이렉트
- `HOME_TAB`, `ABOUT_TAB` 하드코딩을 `generated/tab-defs.ts`로 통합하여 데이터 소스 일원화

#### 2-C: `generateMetadata` 추가
- `[tabId]/page.tsx`에서 탭별 고유한 `title`, `description`, OG 태그를 동적 생성
- 홈 `page.tsx`에서도 별도 메타데이터 설정
- 이것이 없으면 SSG의 SEO 이점이 반감됨

#### 2-D: 콘텐츠 번들 분리 (필수)

현재 `generated/content.ts`가 모든 마크다운을 하나의 파일에 import하므로, `raw-loader` 문자열은 tree-shaking 불가 → 모든 페이지 번들에 전체 콘텐츠 포함됨.

- **`generate-content-index.mjs` 수정:**
    - `generated/tab-defs.ts`: 탭 ID, 라벨, 아이콘, 색상 목록 (모든 페이지에서 공유, NotebookShell/TabStrip에서 사용)
    - `generated/tab-[tabId].ts`: 각 탭의 본문만 포함 (해당 `[tabId]/page.tsx`에서만 import)
- **`type: 'component'` 탭 처리 (`home.tsx` 등):** React 컴포넌트 탭은 `next/dynamic`으로 동적 import하거나, 해당 페이지 컴포넌트에서 직접 import. 마크다운과 처리 방식이 다르므로 스크립트에서 별도 분기 필요.

#### 2-E: 성능 조기 검증 (게이트)

> 단계 3~4 진행 전, 방안 A(`router.push()`) 기반 탭 전환의 체감 성능을 검증.

- `npm run build` → 로컬 static serve로 인접 탭 전환 지연 측정
- 프리패칭 적용 전/후 비교
- **수용 불가 판정 시:** 방안 B(하이브리드) 전환 검토. 이 경우 단계 1의 상태 관리 구조 재설계 필요.

### 단계 3: URL 기반 라우팅 및 앵커 지원 (위험도: 중간 / 단계 2 이후, 단계 4와 병렬 가능)
*   **탭 버튼 교체:** `<button>` → `<Link href="/[tabId]" prefetch={false}>`. 모든 탭이 항상 뷰포트에 노출되므로, 기본 프리패치를 끄지 않으면 페이지 로드 시 모든 탭의 JS 번들을 동시에 요청하게 됨.
*   **선택적 프리패칭:** 현재 탭의 이전/다음 탭만 프로그래밍 방식으로 `router.prefetch('/nextTab')`를 호출. 휠 기반 순차 탐색이 주 패턴이므로 인접 탭만 프리패치하면 충분.
*   **`useHashSync` → `useHeadingTracker`로 재설계:**
    - 탭 동기화 로직 **전면 제거** (URL 경로가 탭을 결정).
    - `IntersectionObserver` 기반 heading 추적만 보존, 라우트 전환 시 Observer **재등록** 처리.
    - URL 형식: `/resume#section-1` (pathname = 탭, hash = 섹션).
    - `pathname` 변경 감지 시 Observer cleanup → 새 heading 등록.

#### 3-A: IntersectionObserver 재등록 타이밍 문제

> App Router에서 `pathname` 변경 시 `children`이 교체됨. Observer를 재등록하려면 **새 콘텐츠의 heading DOM이 실제로 렌더링된 후**여야 함.

**순서 보장 방법 (택 1):**
1. **페이지 컴포넌트 내부에서 등록:** 각 `[tabId]/page.tsx`(또는 `MarkdownSection`) 내부의 `useEffect`에서 heading을 수집하고, Context/콜백으로 `NotebookShell`에 전달.
2. **`MutationObserver` 보조 사용:** `NotebookShell`의 스크롤 컨테이너에 `MutationObserver`를 부착하여 DOM 변화 감지 → heading 재수집 → `IntersectionObserver` 재등록.
3. **`ref` 콜백 패턴:** 콘텐츠 래퍼에 ref 콜백을 사용하여 DOM 마운트 완료 시점에 Observer 등록.

**권장:** 방법 3 (`ref` 콜백) — 가장 단순하고 React 패턴에 부합.

### 단계 4: 마우스 휠 및 네비게이션 연동 (위험도: 높음 / 단계 2 이후, 단계 3과 병렬 가능)

**핵심 문제:** 현재 `setState` 기반 탭 전환은 ~16ms 내 즉시 리렌더. `router.push()`는 히스토리 업데이트 + 페이지 컴포넌트 로드 + 렌더링 오버헤드로 체감 지연 발생 가능. 빠른 연속 휠 시 지연 누적.

*   **방안 A (표준) 기반 최적화 전략:**
    - 인접 탭 프리패칭: 대부분의 전환 시 JS/데이터 이미 로드 완료 상태
    - 연속 휠 디바운싱: 빠른 연속 휠 시 중간 탭을 건너뛰고 최종 탭으로 한 번만 `router.push()`
    - 전환 중 추가 휠 입력 무시: `router.push()` 완료 전까지 추가 전환 차단 (진행 중 플래그)
*   **방안 B (하이브리드) — 방안 A 성능 불만족 시 검토:**
    - 탭 전환은 `useState`로 즉시 처리 + URL만 `history.replaceState()`로 동기화
    - **대가:** 모든 탭 콘텐츠를 클라이언트에 로드해야 함 → `dynamic import`로 lazy-load 필요 → 번들 분리 이점 희석
    - **대가:** `useState` + `usePathname()` 이중 상태 소스 → 동기화 버그 가능성
*   정적 환경에서의 프리패칭 성능 확인 및 최적화.

#### 4-A: 스크롤 위치 복원

> 기존 계획에서 누락된 사항.

- **브라우저 뒤로 가기 시** 이전 탭의 스크롤 위치 복원 전략:
    - `NotebookShell`에서 탭별 스크롤 위치를 `Map<string, number>`으로 캐싱
    - `pathname` 변경 감지 시: 이전 탭의 `scrollTop` 저장 → 새 탭의 저장된 위치로 복원 (없으면 0)
    - `sessionStorage` 활용으로 새로고침 시에도 복원 가능

### 단계 5: 전환 효과 (위험도: 중간 / 단계 3, 4 완료 후)

**기술적 제약:**
- `framer-motion`의 `AnimatePresence`: App Router에서 라우트 변경 시 이전 컴포넌트가 즉시 언마운트되어 exit 애니메이션 미작동 (근본 한계).
- `ViewTransition` API: Chrome 기반에서만 안정, Safari/Firefox 지원 불완전.
- **`pathname`을 `key`로 사용하면 `key` 변경 시 이전 컴포넌트가 즉시 언마운트** → fade-out 불가, fade-in만 가능.

*   **현실적 전략:**
    - 초기 구현은 **fade-in만 적용**: `NotebookShell` 내 콘텐츠 래퍼에 `pathname` 변경 시 CSS `@keyframes fadeIn` 적용.
    - crossfade가 필요하면 이전/현재 `children`을 동시에 렌더링하는 별도 `TransitionWrapper` 필요 (이전 children을 state에 보관).
*   **후속 개선:** Next.js의 `startViewTransition` 통합 또는 `next-view-transitions` 라이브러리를 점진적으로 도입. 노트북 넘기기 애니메이션은 별도 후속 작업으로 분리.

### 단계 6: 정리 및 호환성 (위험도: 낮음 / 단계 5 이후)

> 기존 계획에서 단계 5에 포함되어 있던 잔재 코드 정리와, 누락되었던 호환성 처리를 별도 단계로 분리.

#### 6-A: 레거시 해시 URL 리다이렉트

- 기존에 `#resume` 등의 해시 URL을 공유한 사용자가 있을 수 있음
- 클라이언트 측 리다이렉트 스크립트: 루트 페이지 로드 시 `window.location.hash`를 파싱하여 해당 경로로 `router.replace()` 수행
- 예: `/#resume` → `/resume`, `/#resume/기술-스택` → `/resume#기술-스택`

#### 6-B: SEO 보강

- **sitemap 생성:** `next-sitemap` 패키지 또는 빌드 스크립트로 각 탭 경로를 포함한 `sitemap.xml` 생성
- **robots.txt:** 크롤러 허용 규칙 설정
- **canonical URL:** 각 페이지의 `<link rel="canonical">` 태그 설정

#### 6-C: 잔재 코드 정리

- `useHashSync.ts` 삭제 (→ `useHeadingTracker`로 대체 완료)
- `useTabWheel.ts` 삭제 (→ `useTabNavigation`으로 대체 완료)
- `generated/content.ts` 단일 파일 삭제 (→ `tab-defs.ts` + `tab-[tabId].ts`로 분리 완료)
- `TabButton.tsx`의 `HOME_TAB`, `ABOUT_TAB` 하드코딩 제거 (→ `tab-defs.ts`로 통합 완료)

## 4. 기대 효과 및 고려사항
*   **완벽한 SEO:** 각 페이지가 독립된 HTML + 고유 메타데이터(`generateMetadata`) + sitemap으로 존재하여 크롤러가 전체 내용을 색인할 수 있음.
*   **고유 URL 제공:** 특정 탭을 `/resume`, `/introduction` 같은 깔끔한 URL로 공유 가능. 문서 내 섹션은 `/resume#section-1`로 직접 링크 가능.
*   **레거시 호환:** 기존 해시 URL(`#resume`)이 새 경로(`/resume`)로 자동 리다이렉트.
*   **GitHub Pages 호환:** `trailingSlash: true` + `generateStaticParams`로 모든 경로 정적 HTML 생성. 커스텀 `404.html`로 잘못된 URL도 처리.
*   **콘텐츠 분리:** 탭별 개별 번들로 필요한 페이지의 데이터만 로드, 초기 로딩 성능 최적화.
*   **주의:** GitHub Pages는 실제 서버가 없으므로 모든 "서버 응답"은 빌드된 정적 파일의 서빙임.

## 5. 체크리스트 (각 단계 완료 시 확인)

| 확인 항목 | 관련 단계 |
|-----------|-----------|
| `out/404.html` 정상 생성 | 0 |
| `NotebookShell`이 `children`만 받아 단일 콘텐츠 렌더링 | 1 |
| `display: none` 패턴 완전 제거 | 1 |
| 라우트 전환 시 스크롤 위치 0으로 초기화 | 1 |
| `out/resume/index.html` 등 탭별 HTML 생성 확인 | 2 |
| `/home` 접근 시 `/`로 리다이렉트 | 2 |
| 각 페이지 번들에 해당 탭 콘텐츠만 포함 (번들 분석) | 2 |
| 방안 A 탭 전환 체감 성능 수용 가능 여부 판정 | 2 (게이트) |
| `<Link prefetch={false}>`로 불필요한 프리패치 차단 | 3 |
| 인접 탭 `router.prefetch()` 정상 동작 | 3 |
| heading 앵커(`/resume#section-1`) 정상 스크롤 | 3 |
| 빠른 연속 휠 시 UX 안정성 | 4 |
| 브라우저 뒤로 가기 시 이전 탭 + 스크롤 위치 복원 | 4 |
| 모바일 탭 클릭 전환 정상 동작 | 4 |
| `/#resume` → `/resume` 리다이렉트 | 6 |
| `sitemap.xml` 생성 및 모든 탭 경로 포함 | 6 |
