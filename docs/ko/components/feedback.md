# 피드백 컴포넌트

알림과 로딩 상태. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `alert`

severity가 있는 배너 스타일 알림.

<!-- gen:props type=alert -->
| Prop | Type | Description |
|---|---|---|
| `title` | string | Alert title |
| `message` | string | Alert body text |
| `severity` | `"info"` \| `"warn"` \| `"error"` \| `"success"` | Color/icon style |
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
| Prop | Type | Description |
|---|---|---|
| `value` | number | Percentage 0–100 |
| `label` | string | Optional label shown alongside |
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
| Prop | Type | Description |
|---|---|---|
| `message` | string | Toast body |
| `severity` | `"info"` \| `"warn"` \| `"error"` \| `"success"` | Color style |
<!-- /gen:props -->

```yaml
toast:
  severity: success
  message: "Settings saved"
```

## `modal`

모달 다이얼로그 플레이스홀더. 인라인으로 그려짐 (실제 오버레이 아님) — 스케치 목적.

<!-- gen:props type=modal -->
| Prop | Type | Description |
|---|---|---|
| `title` | string | Dialog title |
| `body` | string | Dialog body text |
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
| Prop | Type | Description |
|---|---|---|
| `width` | string \| number | Width of the shimmer area |
| `height` | string \| number | Height of the shimmer area |
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
