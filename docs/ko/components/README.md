# 컴포넌트 레퍼런스

8개 카테고리 44개 내장 컴포넌트. 모든 컴포넌트는 타입별 프롭 위에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props) (`id`, `w`, `h`, `align`, `pad`, `note`, `muted`)을 받습니다.

| 카테고리 | 컴포넌트 | 개수 |
|---|---|---|
| [**레이아웃**](./layout.md) | `container` · `card` · `panel` · `divider` · `spacer` | 5 |
| [**내비게이션**](./navigation.md) | `navbar` · `sidebar` · `tabs` · `breadcrumb` · `pagination` · `stepper` | 6 |
| [**기본 입력**](./input-basic.md) | `button` · `input` · `textarea` · `select` · `checkbox` · `radio` | 6 |
| [**고급 입력**](./input-advanced.md) | `toggle` · `slider` · `date-picker` · `file-upload` · `search` | 5 |
| [**표시**](./display.md) | `heading` · `text` · `image` · `icon` · `avatar` · `badge` · `tag` · `kbd` | 8 |
| [**피드백**](./feedback.md) | `alert` · `progress` · `toast` · `modal` · `skeleton` | 5 |
| [**데이터**](./data.md) | `table` · `list` · `tree` · `kv-list` | 4 |
| [**플레이스홀더**](./placeholder.md) | `chart` · `map` · `video` · `placeholder` | 4 |
| [**탈출구**](./raw.md) | `raw` | 1 |

## 프롭 표 표기

- `string` / `number` / `boolean` — 원시 타입.
- `string[]` — 문자열 배열.
- `"a" \| "b" \| "c"` — 열거형; 이 값들만 허용됨.
- `number \| string` — 유니온; 둘 다 허용.
- 별도 표기가 없는 한 프롭은 모두 선택. 대부분의 컴포넌트는 프롭 없이도 무난하게 렌더링됩니다 (플레이스홀더로 유용).

알 수 없는 추가 프롭은 무시 — 에러가 나지 않으므로 YAML에 주석처럼 자유롭게 표기해도 렌더링은 깨지지 않습니다.

## 오타 제안

컴포넌트 타입을 잘못 쓰면 (예: `button` 대신 `buton`), Levenshtein 거리 ≤ 2 범위에서 가장 가까운 유효 이름을 제안합니다. 인라인 에러 주위의 와이어프레임은 정상 렌더링.
