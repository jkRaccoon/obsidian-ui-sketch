# 네비게이션 컴포넌트 고도화 (GNB / LNB) 설계

- 날짜: 2026-05-29
- 대상: `src/components/navbar.ts`, `src/components/sidebar.ts` (보조: `src/components/avatar.ts`)
- 상태: 승인됨 (사용자가 추천안 일괄 위임)

## 배경 / 목표

현재 `navbar`(GNB)와 `sidebar`(LNB)는 `items`로 **평면 문자열 배열**만 받는다. 실무 와이어프레임에서 흔한 다음 패턴을 표현할 수 없다.

- **LNB**: 섹션 그룹 헤더, 2뎁스 중첩 메뉴, 항목 아이콘, 접힌(collapsed) 사이드바
- **GNB**: 드롭다운/서브메뉴, 현재 메뉴 강조(active), brand 반대편 액션 영역(아이콘/아바타/버튼)

**목표**: 위 패턴을 표현하되 기존 문자열 배열 YAML을 깨지 않는다(하위 호환).

## 비목표 (YAGNI)

- 3뎁스 이상 무한 중첩 — `tree` 컴포넌트가 담당. navbar/sidebar 모두 1단계 중첩(2뎁스)까지만.
- 실제 인터랙션(클릭 시 펼침). 와이어프레임은 정적 — `open`/`collapsed` 플래그로 "상태"를 정적으로 렌더.
- 메뉴 항목 배지(알림 카운트), navbar 검색 입력 슬롯. 필요하면 별도 요청. (검색은 이미 `search`/`input` 컴포넌트 존재)

## 설계

### 공통: 아이콘 표현

`icon: "home"` 문자열을 받아 기존 `icon` 컴포넌트와 동일 규칙(첫 글자 박스, `name[0]`)으로 렌더한다. 와이어프레임이므로 실제 아이콘 폰트는 쓰지 않는다. `avatar`의 이니셜 로직은 `avatar.ts`에서 `initials()`를 export해 `navbar`에서 재사용한다(중복 제거).

### navbar (GNB)

```ts
// 메뉴 항목: 문자열 또는 객체
const NavChildSchema = z.union([
  z.string(),
  z.object({ label, icon, active }).passthrough(),
]);
const NavItemSchema = z.union([
  z.string(),
  z.object({ label, icon, active, open, children: NavChildSchema[] }).passthrough(),
]);
// 우측 액션 슬롯
const NavActionSchema = z.object({ icon, avatar, label }).passthrough();

NavbarSchema = BasePropsSchema.extend({
  brand:   z.string().optional(),
  items:   z.array(NavItemSchema).optional(),
  actions: z.array(NavActionSchema).optional(),
}).passthrough();
```

렌더링:

- `.uis-navbar` > `.uis-navbar__brand`(좌) + `.uis-navbar__items` + `.uis-navbar__actions`(우)
- 항목: 문자열이면 기존대로. 객체면 `icon`→앞 아이콘, `active`→`--active`, `children`→`▾` 캐럿 + `--has-menu`. `open: true`면 항목 아래 `.uis-navbar__dropdown` 패널(absolute)을 펼쳐 children을 정적으로 표시.
- `actions`: `{icon}`→아이콘 박스, `{avatar}`→이니셜 원, `{label}`→텍스트 버튼.
- 레이아웃 호환: `actions`가 있을 때만 navbar에 `--has-actions`를 붙여 `items`의 `margin-left:auto`를 해제(=items 좌측, actions 우측). `actions`가 없으면 기존 모양(items 우측 정렬) 유지.

### sidebar (LNB)

```ts
const SideChildSchema = z.union([
  z.string(),
  z.object({ label, icon, active }).passthrough(),
]);
const SideItemSchema = z.union([
  z.string(),
  z.object({ section, label, icon, active, children: SideChildSchema[] }).passthrough(),
]);

SidebarSchema = BasePropsSchema.extend({
  items:     z.array(SideItemSchema).optional(),
  active:    z.union([z.string(), z.number()]).optional(), // 기존 유지
  collapsed: z.boolean().optional(),                        // 접힘 상태
}).passthrough();
```

렌더링:

- `.uis-sidebar` (collapsed면 `--collapsed`)
- `{section}` → `.uis-sidebar__section` (대문자/muted 헤더)
- 항목: 문자열이면 기존대로. 객체면 `icon`→아이콘, `children`→`.uis-sidebar__children`에 1뎁스 들여쓰기로 **항상 펼쳐** 표시.
- active 판정: 객체의 `active: true` **OR** top-level `active`가 라벨과 일치 **OR** top-level `active`(숫자)가 전체 배열 인덱스와 일치(기존 호환).
- `collapsed`면 라벨·섹션 텍스트와 children을 숨기고 아이콘만, `min-width` 축소.

### 하위 호환

- `items: ["Home","Docs"]`(문자열 배열)와 `active: "Docs" | 1`은 기존과 동일하게 동작.
- `actions` 미사용 navbar는 시각적으로 기존과 동일.
- 기존 `navbar.test.ts` / `sidebar.test.ts`는 수정 없이 통과해야 한다(회귀 가드).

### 에러 모델

스키마가 union/`.passthrough()`라 관대하다. 형태가 어긋나면 기존 L3 인라인 에러로 surface. 신규 검증 분기는 추가하지 않는다.

### 스타일

신규 클래스(`__section`, `__icon`, `__children`, `__caret`, `__dropdown`, `__actions`, `--collapsed`, `--has-actions`)는 모두 Obsidian CSS 변수만 사용한다. 색상 하드코딩 금지.

## 테스트 계획

- navbar: (회귀) 기존 brand+items / (신규) 객체 항목 active, children 캐럿, `open` 드롭다운, actions의 icon·avatar·label, `--has-actions` 토글.
- sidebar: (회귀) 기존 items+active / (신규) section 헤더, 객체 아이콘, 객체 active, children 들여쓰기, collapsed.

## 구현 단계

1. `avatar.ts`: `initials()` export.
2. `navbar.ts`: 스키마 + 렌더 확장.
3. `sidebar.ts`: 스키마 + 렌더 확장.
4. `styles.css`: 신규 클래스(Obsidian 변수만).
5. 테스트 보강(navbar/sidebar).
6. `gen-component-docs.ts`의 `DESCRIPTIONS`(en/ko) 갱신 → `docs/components/navigation.md` + `docs/ko/components/navigation.md` 예시 추가 → `npm run gen:docs`.
7. 검증: `npm run typecheck` / `npm test` / `npm run build` / `npm run lint` + `npm run preview`로 GNB+LNB 조합 시각 확인.
8. 커밋 / 푸시 / PR.
