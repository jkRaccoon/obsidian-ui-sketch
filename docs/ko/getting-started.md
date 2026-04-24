# 시작하기

5분 안에 첫 와이어프레임을 만들어봅시다. 플러그인이 이미 설치되어 있다고 가정합니다 (설치 방법은 [메인 README](../../README.ko.md#-빠른-시작) 참고).

## 1. 코드 블록 만들기

아무 노트에 `ui-sketch` 언어 태그로 코드 블록을 작성:

````markdown
```ui-sketch
screen:
  - button: { label: "Hello" }
```
````

읽기 뷰 (`Cmd/Ctrl+E`)로 전환하면 버튼이 보입니다.

## 2. viewport 프레임 추가

기본적으로 데스크톱 너비(1200px)로 렌더링됩니다. 변경하려면:

```yaml
viewport: mobile
screen:
  - button: { label: "Sign in" }
```

유효한 viewport: `desktop` (1200px), `tablet` (768px), `mobile` (375px), 또는 명시적인 `width:`/`height:`가 붙은 `custom`.

## 3. 컴포넌트 수직으로 쌓기

`screen:`은 배열이라서 항목이 위에서 아래로 렌더링됩니다:

```yaml
screen:
  - heading: { level: 1, text: "Welcome" }
  - text: { value: "Sign in to continue." }
  - input: { placeholder: "Email" }
  - button: { label: "Continue", variant: primary }
```

## 4. `row`로 가로 배치

항목을 `row`로 감싸면 수평으로 배치됩니다. `col`은 중첩할 때 수직 배치:

```yaml
screen:
  - row:
      gap: 16
      items:
        - card: { title: "Revenue", body: "$12,400" }
        - card: { title: "Users",   body: "342" }
        - card: { title: "Errors",  body: "0" }
```

`gap:`으로 간격(px)을 조절합니다. `col` 안에 `flex:`를 설정하면 비율로 컬럼 크기 조절 (`flex: 1` vs `flex: 3`이면 1:3 비율).

## 5. 모든 컴포넌트가 지원하는 공통 프롭

어떤 컴포넌트든 타입별 프롭 위에 다음을 받습니다:

```yaml
button:
  label: "Save"       # 컴포넌트별 프롭
  w: 160              # 너비 (px 또는 "50%")
  h: 40               # 높이
  align: center       # start | center | end
  pad: 12             # 패딩
  note: "Saves draft" # 호버 툴팁 (ⓘ 표시)
  muted: true         # 강조 낮춤
  id: primary-save    # 선택 식별자
```

상세는 [YAML 레퍼런스](./yaml-reference.md#공통-프롭-base-props) 참고.

## 6. 주석 달기

`note:`는 디자인 주석에 편리합니다 — ⓘ 마커와 함께 호버 툴팁이 생겨서, 시각 요소는 깔끔하게 유지하면서 의도를 설명할 수 있음:

```yaml
screen:
  - button:
      label: "Delete account"
      variant: danger
      note: "Requires password confirmation in follow-up modal"
```

## 다음 단계

- **[YAML 레퍼런스](./yaml-reference.md)** — 대시보드용 `grid:` 포함 전체 문법.
- **[컴포넌트 레퍼런스](./components/README.md)** — 44개 컴포넌트의 전체 프롭 표.
- **[레시피](./recipes/dashboard.md)** — 자주 쓰는 화면의 복사-붙여넣기 템플릿.

예상대로 렌더링이 안 되면 [문제 해결](./troubleshooting.md) 참고 — 플러그인이 상세한 에러 메시지를 보여주고, 대부분 명확한 해결책이 있습니다.
