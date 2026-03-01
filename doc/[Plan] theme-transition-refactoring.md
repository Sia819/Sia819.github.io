# 테마 전환 트랜지션 리팩토링 계획

## 1. 현재 상태

### 변경된 파일 (3개)

| 파일 | 변경 내용 |
|------|----------|
| `globals.css` | `--theme-td` CSS 변수, `*` 전역 트랜지션, `.tab-btn` 합성, `color-scheme: normal !important` |
| `NotebookShell.tsx` | 바인더 스파인 `linear-gradient` → `backgroundColor` |
| `TabButton.tsx` | `transition-all duration-150` → `.tab-btn` CSS 클래스, 액센트라인 `transition-colors` 제거 |

### 현재 구조

```css
:root {
  --theme-td: 0.2s;  /* 이 값 하나로 전체 속도 제어 */
}
html { color-scheme: normal !important; }  /* 브라우저 UA 이중 전환 차단 */
* { transition: background-color, color, border-color, fill, stroke, box-shadow; }
.tab-btn { transition: /* 레이아웃(150ms) + 색상(--theme-td) 합성 */ }
```

## 2. 업계 표준 대비 평가

### 2-1. `--theme-td` CSS 변수로 duration 중앙 관리

| 항목 | 내용 |
|------|------|
| 업계 표준 | CSS 변수로 디자인 토큰(duration, easing) 관리하는 것은 **모범 사례**. Material Design, Radix, Shadcn 등 주요 디자인 시스템에서 사용 |
| 현재 방식 | 좋음. 디버깅 시 한 값만 바꾸면 전체 속도 변경 가능 |
| 판정 | **유지** |

### 2-2. `*` 선택자로 전역 트랜지션

| 항목 | 내용 |
|------|------|
| 업계 표준 | `*` 전역 트랜지션은 **일반적으로 권장되지 않음** |
| 이유 | 1) 성능 — 많은 DOM 노드에 트랜지션 계산 부하 |
|      | 2) 충돌 — `transition`은 shorthand로 동작하여, `*`가 설정한 값을 컴포넌트가 override하면 테마 색상 트랜지션이 소실 (`.tab-btn`에서 이미 발생) |
|      | 3) 의도치 않은 부작용 — 외부 라이브러리 컴포넌트, 모달, 드롭다운 등에도 적용 |
| 대안 A | **개별 선택자** — 명시적으로 트랜지션 대상 나열. 정밀하지만 새 요소 추가 시마다 수정 필요 |
| 대안 B | **`@property` 등록** — CSS 변수 자체를 트랜지션. 요소별 `transition` 불필요 (근본 해결) |
| 판정 | **현 규모에서는 실용적이나, 컴포넌트 추가 시 기술 부채 누적 가능** |

### 2-3. `color-scheme: normal !important`

| 항목 | 내용 |
|------|------|
| 업계 표준 | `next-themes`에서는 `enableColorScheme={false}`를 **컴포넌트 prop으로** 처리하는 것이 공식 API |
| 현재 방식 | CSS `!important`로 JS 라이브러리의 inline style을 강제 덮어씀 |
| 문제점 | fragile — `next-themes` 업데이트, 다른 라이브러리의 `color-scheme` 의존 시 예기치 않은 파손 가능 |
| 대안 | `ThemeProvider`에 `enableColorScheme={false}` prop 전달 (한 줄, 공식 API). 단, `layout.tsx` 수정 필요 |
| 판정 | **공식 API 사용이 더 안전. CSS로 억지 override는 비권장** |

### 2-4. 바인더 스파인 `linear-gradient` → `backgroundColor`

| 항목 | 내용 |
|------|------|
| 트레이드오프 | 트랜지션 가능하게 만들기 위해 **시각적 디테일(그라데이션) 제거** |
| 대안 | `@property`로 `--spine`, `--spine-light`를 `<color>` 타입으로 등록하면 gradient 내부 색상도 트랜지션 가능 |
| 판정 | **시각적 손실 발생. `@property`로 복원 가능** |

### 2-5. `.tab-btn` 레이아웃+색상 합성

| 항목 | 내용 |
|------|------|
| 문제점 | `*`의 색상 트랜지션과 `.tab-btn`의 색상 트랜지션이 **동일 속성 중복 선언** (DRY 위반) |
| 원인 | CSS `transition`이 shorthand여서 `.tab-btn`이 `*`를 완전히 덮어씀. 레이아웃 속성을 추가하려면 색상 속성도 재선언 필수 |
| 대안 | `@property` 방식 사용 시, 요소별 `transition: color` 자체가 불필요해지므로 `.tab-btn`에는 레이아웃 트랜지션만 남김 |
| 판정 | **현재 구조의 본질적 한계. `@property`로 해결 가능** |

## 3. 이상적 리팩토링 (안)

### `@property` 기반 접근

CSS 변수 자체를 `<color>` 타입으로 등록하면, 변수 값 변경 시 **`:root` 레벨에서 트랜지션**이 발생한다. 개별 요소에 `transition: color` 등을 설정할 필요가 없어진다.

```
현재 방식:
  CSS 변수 변경 → 즉시 반영 → 요소별 transition으로 보간
  문제: * 선택자 필요, 요소마다 override 충돌, color 상속 배수 문제

@property 방식:
  CSS 변수 변경 → 변수 자체가 보간 → 모든 참조 요소에 자동 반영
  장점: * 선택자 불필요, override 충돌 없음, 상속 배수 문제 없음
```

```css
/* 예시 */
@property --paper {
  syntax: '<color>';
  inherits: true;
  initial-value: #fdfcfa;
}
@property --kraft {
  syntax: '<color>';
  inherits: true;
  initial-value: #e8dece;
}
/* ... 나머지 색상 변수 등록 ... */

:root {
  --theme-td: 0.2s;
  transition: --paper var(--theme-td) ease,
              --kraft var(--theme-td) ease,
              /* ... */;
}
```

### 장단점 비교

| | 현재 (`*` 전역) | `@property` 방식 |
|---|---|---|
| **관리 포인트** | `*` 규칙 1개 + 충돌 요소마다 override | `@property` 등록 + `:root` transition 1개 |
| **충돌 위험** | 높음 — `transition` shorthand 충돌 | 없음 — 요소별 transition 불필요 |
| **상속 배수** | 가능성 있음 | 없음 — 변수 레벨에서 보간 |
| **gradient 트랜지션** | 불가 (solid color로 대체 필요) | 가능 (변수가 보간되므로) |
| **초기 작업량** | 적음 | 많음 (변수 약 40~50개 등록) |
| **브라우저 지원** | 모든 브라우저 | Chrome 85+, Firefox 128+, Safari 15.4+ (2024 기준 전체의 약 95%) |
| **추후 유지보수** | 새 컴포넌트 추가 시 충돌 점검 필요 | 새 CSS 변수 추가 시 `@property` 등록만 |

## 4. 권장 사항

| 우선순위 | 작업 | 난이도 | 영향도 |
|---------|------|--------|--------|
| **1** | `color-scheme: !important` → `enableColorScheme={false}` prop으로 이동 | 낮음 | 안정성 향상 |
| **2** | 바인더 스파인 gradient 복원 (`@property` 2개만 등록) | 낮음 | 시각적 복원 |
| **3** | 전체 색상 변수 `@property` 등록 + `*` 규칙 제거 | 높음 | 근본적 해결 |

- 우선순위 1, 2는 현재 즉시 적용 가능 (소규모 변경)
- 우선순위 3은 프로젝트 규모가 커질 때 검토. 현재 포트폴리오 사이트 규모에서는 **오버엔지니어링**일 수 있음
