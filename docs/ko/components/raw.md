# `raw` — HTML 탈출구

내장 컴포넌트로 부족할 때, `raw:`는 제한된 HTML 일부를 주입할 수 있게 해줍니다. 모든 입력은 렌더링 전에 엄격한 허용 목록이 있는 [`sanitize-html`](https://github.com/apostrophecms/sanitize-html)을 통과합니다 — 스크립트 실행이나 이벤트 핸들러 연결은 불가능.

가능하면 내장 컴포넌트를 선호하세요. `raw:`는 의도적으로 mid-fi입니다; 풍부한 임베드는 v0.2 목표가 아닙니다.

## 프롭

<!-- gen:props type=raw -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `html` | string | sanitize된 HTML (sanitize-html 통과) |
| `text` | string | 순수 텍스트 — textContent만 |
<!-- /gen:props -->

그리고 모든 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props). `html`과 `text`를 둘 다 주면 `html`이 이깁니다.

## 허용 태그

```
b, i, em, strong, a, p, br,
span, div, ul, ol, li, code, pre,
h1, h2, h3, h4, h5, h6, blockquote
```

다른 태그(`script`, `style`, `iframe`, `img`, `object`, `form`, `input`, `button` 포함)는 제거됩니다.

## 허용 속성

- `<a>` 태그: `href`만 (`target`/`rel`/`onclick` 불가)
- 모든 태그: `class`, `style`

## 허용 style 속성

인라인 `style` 속성은 파싱 후 필터링됩니다. 살아남는 속성만:

```
color, background, font-weight, text-align, padding, margin
```

다른 CSS 속성 (`position`, `transform`, `display`, `background-image`의 URL 등)은 제거됩니다.

## 예시

### 태그가 섞인 인라인 강조

```yaml
raw:
  html: "Release <strong>0.2.1</strong> · <code>npm install</code>"
```

### 링크 포함 문단

```yaml
raw:
  html: '<p>See the <a href="https://example.com">docs</a> for details.</p>'
```

### 순수 텍스트 (HTML 파싱 없음)

```yaml
raw:
  text: "Just <em>plain</em> text — these tags are shown literally"
```

## 보안 주의

- 스크립트, 이벤트 핸들러 (`onclick` 등), `javascript:` URL은 모두 제거됩니다. 플러그인 불변성.
- 허용 목록을 넘는 기능이 필요하면 실제 컴포넌트 추가를 고려하세요 — 사용 사례와 함께 이슈를 열어주세요.
- `raw:`는 Obsidian 마크다운의 지름길이 아닙니다. Obsidian의 노트 렌더링 파이프라인은 `raw:` 콘텐츠에서 실행되지 않음; sanitize된 HTML만 렌더링됩니다.
