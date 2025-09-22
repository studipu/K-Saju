# K-Saju

K-Saju는 외국인 관광객과 한국의 전통 점술(사주/타로) 전문가를 연결하는 플랫폼입니다. 실시간 통역(LLM), 위치 기반 체험, 일정 관리, 다국어 지원을 통해 언어 장벽 없이 한국 문화 점술 체험을 제공합니다.

## 기술 스택
- Frontend: React + Vite + TypeScript, styled-components
- 라우팅: react-router-dom
- Firebase: Hosting, Data Connect(Cloud SQL(Postgres) + GraphQL), Emulator
- 품질: ESLint, TypeScript 설정, Tailwind(PostCSS 플러그인 사용)
- 아이콘: Heroicons

## 프로젝트 구조
```text
K-Saju/
  ├─ src/
  │  ├─ components/
  │  │  ├─ gnb.tsx                # GNB(Global Navigation Bar): 상단 네비게이션 및 검색/계정 진입
  │  │  ├─ layout.tsx             # 전체 레이아웃 컨테이너(GNB + Main + Footer)
  │  │  ├─ footer.tsx             # 푸터(고객지원/법적 고지 링크 등)
  │  │  ├─ loading_screen.tsx     # 초기 로딩/인증 대기 화면
  │  │  ├─ not_found.tsx          # 404 Not Found 페이지
  │  │  ├─ protected_route.tsx    # 인증 보호 라우트 Wrapper (로그인 필요 페이지 보호)
  │  │  └─ auth_components.tsx    # 로그인/회원가입 공용 UI 조각
  │  ├─ routes/
  │  │  ├─ home.tsx               # 홈(인트로/배너 등 간단한 랜딩)
  │  │  ├─ locations.tsx          # 체험 목록 + 우측 고정 지도(목록/그리드 전환, 가격 마커)
  │  │  ├─ profile.tsx            # 사용자 프로필(ProtectedRoute 적용)
  │  │  ├─ messages.tsx           # 메시지/문의(ProtectedRoute 적용)
  │  │  ├─ support.tsx            # 고객지원(문의 안내, 링크)
  │  │  ├─ faq.tsx                # FAQ(자주 묻는 질문)
  │  │  ├─ sign_in.tsx            # 로그인
  │  │  ├─ sign_up.tsx            # 회원가입
  │  │  ├─ kakao_callback.tsx     # 카카오 로그인 콜백 처리
  │  │  └─ live_translation.tsx   # 실시간 통역(LLM) 데모/체험 화면
  │  ├─ i18n/i18n.tsx             # 다국어(i18n) 초기화/설정
  │  ├─ firebase.ts               # Firebase 클라이언트 초기화
  │  ├─ index.css / main.tsx / App.tsx
  │  └─ types/global.d.ts         # 전역 타입(예: window.google, SpeechRecognition 등)
  │
  ├─ dataconnect/                 # Firebase Data Connect(Cloud SQL + GraphQL)
  │  ├─ dataconnect.yaml          # 서비스/인스턴스/스키마 소스 정의
  │  ├─ schema/
  │  │  └─ schema.gql             # GraphQL 스키마(Hosts, Places, Locations, Photos, Reviews...)
  │  └─ connector/
  │     ├─ connector.yaml         # SDK 생성 설정(outputDir 등)
  │     ├─ queries.gql            # 조회 쿼리(ListLocations, GetLocationById 등)
  │     └─ mutations.gql          # 시드/업서트(SeedMock..., SeedLocationPhotos, SwapLocationThumbnails)
  │
  ├─ dataconnect-generated/       # Data Connect로 생성된 SDK (@firebasegen/default-connector)
  │  └─ js/default-connector/...  # JS/React SDK 및 README
  │
  ├─ saju-llm/                    # LLM/음성 관련 Python 실험 코드(번역/tts 등)
  │  └─ src/...                   # 모듈 구성(prompts, translator, tts 등)
  │
  ├─ public/                      # 정적 자산
  ├─ dist/                        # Vite 빌드 산출물
  ├─ firebase.json                # Hosting/Emulator/Data Connect 설정
  ├─ vite.config.ts / tsconfig*.json / eslint.config.js / tailwind.config.js
  └─ README.md
```

## 주요 페이지 설명(간단)
- Home(`/`): 간단한 랜딩. 향후 추천 체험/가이드 진입점.
- Locations(`/locations`):
  - 좌측: 체험 카드 목록(목록/그리드 토글). 카드는 제목/요약/가격/지역 노출.
  - 우측: 페이지 내부에서 고정되는 Google Maps. 가격 마커 클릭 시 해당 카드로 스크롤 연동.
  - 확대/축소/확장 버튼(Heroicons) 제공. 헤더와 지도 상단 정렬선 일치.
- Profile(`/profile`): 사용자 정보/설정(인증 필요).
- Messages(`/messages`): 문의/대화 목록(인증 필요).
- Support(`/support`), FAQ(`/faq`): 고객지원과 자주 묻는 질문.
- Sign In(`/sign-in`), Sign Up(`/sign-up`): 이메일/소셜 로그인/가입.
- Kakao Callback(`/kakao-callback`): 카카오 로그인 리다이렉트 처리.
- Live Translation(`/live-translation`): LLM 기반 실시간 통역 체험.

## 데이터 모델 및 조회 개요(Data Connect)
- 스키마(`schema.gql`):
  - `hosts`(호스트), `places`(지역/만남장소), `locations`(체험 본문), `location_photos`(이미지), `reviews`, `location_stats` 등.
  - 대표 썸네일은 `location_photos.sortOrder = 0` 레코드 사용 권장.
- 커넥터(`queries.gql`):
  - `ListLocations`: 각 Location의 메타 + `photos_on_location(order_by: {sortOrder: ASC}, limit: 1)`로 대표 이미지 조회 가능.
  - `GetLocationById`: 상세(스텝/준비물/세션/리뷰 등 포함) 조회 예시.
- 시드/업서트(`mutations.gql`):
  - `SeedMockHosts/SeedMockPlaces/SeedMockLocations`: 기본 더미 데이터 생성.
  - `SeedLocationPhotos`: 다양한 이미지 삽입.
  - `SwapLocationThumbnails`: 모든 Location에 서로 다른 대표 썸네일(sortOrder=0) 지정.

## 환경 변수
- Google Maps: `.env`에 아래 키 필요.
`VITE_KAKAO_REDIRECT_URI`
`VITE_KAKAO_CLIENT_ID`
`VITE_KAKAO_CLIENT_SECRET`
`VITE_GOOGLE_MAPS_API_KEY`

## 실행/배포
```bash

# 처음 git clone을 했을 경우 npm i @xxx로 코드의 패키지를 모두 다운 받아야 -> 클로드에게 부탁

# 개발 서버 실행
npm run dev

# 서버에 배포
npm run deploy
