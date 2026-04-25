# 레시피

자주 쓰이는 UI 레이아웃의 복사-붙여넣기 템플릿 — 단순한 것부터 복잡한 것까지.

## Simple

빠른 패턴, 보통 10–20줄 YAML.

- **[랜딩 히어로](./hero.md)** — 중앙 헤드라인 + 태그라인 + CTA 버튼
- **[빈 상태](./empty-state.md)** — 아이콘 + 설명 + 액션을 가진 플레이스홀더 화면
- **[카드 그리드](./card-grid.md)** — 3열 제품/기능 카드 레이아웃
- **[확인 모달](./confirmation-modal.md)** — 삭제 스타일 확인 다이얼로그

## 폼

라벨 정렬, 그룹 입력, 유효성 상태를 보여주는 폼 레이아웃.

- **[로그인 폼](./login-form.md)** — 모바일 중앙 정렬 + 데스크톱 gutter 변형
- **[연락처 폼](./contact-form.md)** — select + textarea 가 있는 표준 라벨 폼
- **[설정 패널](./settings-panel.md)** — 그룹 토글이 있는 2컬럼 설정
- **[자재 등록 (material registration)](./material-registration.md)** — 섹션, 뱃지, 조건부 필드가 있는 한국 ERP 폼

## 레이아웃

전체 화면 구성 — navbar + sidebar + main 콘텐츠 패턴.

- **[대시보드](./dashboard.md)** — 클래식 관리자 대시보드, grid/flex 변형
- **[이메일 클라이언트](./email-client.md)** — 3 패널 받은 편지함 + 목록 + 읽기 창
- **[문서 사이트](./docs-site.md)** — 브레드크럼 + 사이드바 + 콘텐츠의 문서 레이아웃
- **[가격 페이지](./pricing-page.md)** — 티어 비교 카드
- **[프로필 페이지](./profile-page.md)** — 아바타 헤더 + 탭 + 상세 패널

## 데이터

표, 메트릭, 리스트, 피드 중심의 화면.

- **[관리자 표](./admin-table.md)** — 검색, 탭, 페이지네이션이 있는 사용자 관리 표
- **[애널리틱스 대시보드](./analytics-dashboard.md)** — KPI 카드 + 차트 플레이스홀더 + 이벤트 표
- **[활동 피드](./activity-feed.md)** — 뱃지를 곁들인 이벤트 타임라인

## 스크린샷 생성 방식

각 레시피의 스크린샷은 `npm run gen:screenshots` 로 YAML 블록에서 자동 생성됩니다 (Obsidian CSS 변수 디폴트가 주입된 헤드리스 Chromium). 새 레시피를 기여하려면 여기에 `.md` 파일에 ```ui-sketch 블록 하나를 넣고 스크립트 실행 — PNG가 `docs/img/recipes/` 에 자동 저장됩니다.
