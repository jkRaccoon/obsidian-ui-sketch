# 레시피 — 랜딩 히어로

중앙 정렬된 헤드라인, 태그라인, 그리고 두 개의 CTA 버튼 — 마케팅 페이지의 표준 히어로 섹션.

```ui-sketch
viewport: desktop
screen:
  - spacer: { size: 80 }
  - heading:
      level: 1
      text: "Build faster with UI Sketch"
      align: center
  - spacer: { size: 12 }
  - text:
      value: "Mid-fidelity wireframes from YAML — right inside your Obsidian notes."
      tone: muted
      align: center
  - spacer: { size: 28 }
  - row:
      gap: 12
      items:
        - col: { flex: 1, items: [] }
        - button: { label: "Get started", variant: primary }
        - button: { label: "View on GitHub", variant: secondary }
        - col: { flex: 1, items: [] }
  - spacer: { size: 60 }
  - row:
      items:
        - col: { flex: 1, items: [] }
        - image: { src: "hero.png", alt: "Product screenshot", w: 720, h: 360 }
        - col: { flex: 1, items: [] }
```

![랜딩 히어로](../../img/recipes/hero.png)

## 패턴 메모

- `align: center` 가 text와 heading을 컬럼 안에서 중앙 정렬.
- 버튼 row 양쪽의 `col { flex: 1, items: [] }` 래퍼가 고정 너비 없이 중앙 클러스터를 만듭니다.
- image 블록은 플레이스홀더 — `src` 는 호버 메타데이터로 표시되고 실제로 가져오진 않음.
