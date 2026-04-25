# 피드백 컴포넌트

알림과 로딩 상태. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `npm run gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `alert`

severity가 있는 배너 스타일 알림.

<!-- gen:props type=alert -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `title` | string | 알림 제목 |
| `message` | string | 알림 본문 |
| `severity` | `"info"` \| `"warn"` \| `"error"` \| `"success"` | 색상/아이콘 스타일 |
<!-- /gen:props -->

```yaml
alert:
  severity: warn
  title: "Heads up"
  message: "Review your changes before committing."
```

> **주의:** `severity` 열거형은 `info` / `warn` / `error` / `success` (not `warning`). `warning`을 쓰면 L3 인라인 에러가 납니다.

## `progress`

0–100 값의 프로그레스 바.

<!-- gen:props type=progress -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `value` | number | 퍼센트 0–100 |
| `label` | string | 옆에 표시할 옵션 라벨 |
<!-- /gen:props -->

```yaml
progress:
  value: 42
  label: "Uploading..."
  w: 320
```

## `toast`

일시적 알림 칩 — 보통 화면 모서리에 표시됩니다.

<!-- gen:props type=toast -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `message` | string | 토스트 본문 |
| `severity` | `"info"` \| `"warn"` \| `"error"` \| `"success"` | 색상 스타일 |
<!-- /gen:props -->

```yaml
toast:
  severity: success
  message: "Settings saved"
```

## `modal`

모달 다이얼로그 플레이스홀더. 인라인으로 그려짐 (실제 오버레이 아님) — 스케치 목적.

<!-- gen:props type=modal -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `title` | string | 다이얼로그 제목 |
| `body` | string | 다이얼로그 본문 |
<!-- /gen:props -->

```yaml
modal:
  title: "Confirm deletion"
  body: "This action cannot be undone."
  w: 400
```

## `skeleton`

로딩 상태용 회색 shimmer 플레이스홀더.

<!-- gen:props type=skeleton -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `width` | string \| number | shimmer 영역 너비 |
| `height` | string \| number | shimmer 영역 높이 |
<!-- /gen:props -->

```yaml
col:
  gap: 8
  items:
    - skeleton: { width: "80%", height: 20 }
    - skeleton: { width: "60%", height: 14 }
    - skeleton: { width: "90%", height: 14 }
```

> **주의:** `skeleton`은 공통 `w`/`h`가 아니라 `width`/`height`를 씁니다 — 의미가 다르기 때문 (바깥 박스가 아니라 *shimmer 영역* 크기).
