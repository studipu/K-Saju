## K-Saju

K-Saju는 외국인 관광객과 한국의 전통 점술(사주/타로) 전문가를 연결하는 플랫폼입니다. 실시간 통역(LLM), 위치 기반 체험, 일정 관리, 다국어 지원을 통해 언어 장벽 없이 한국 문화 점술 체험을 제공합니다.

## 기술 스택
- **Frontend**: React + Vite + TypeScript, styled-components, Tailwind(PostCSS)
- **라우팅**: react-router-dom
- **백엔드**: Supabase(Auth, Storage, Postgres)
- **품질**: ESLint, TypeScript
- **아이콘**: Heroicons

## 주요 페이지
- `/` 홈(랜딩)
- `/locations` 체험/위치 목록 + 지도(Seoul)
- `/profile` 프로필(아바타 업로드: Supabase Storage)
- `/messages` 메시지(향후)
- `/support`, `/faq` 고객지원/FAQ
- `/sign-in`, `/sign-up` 로그인/회원가입
- `/kakao-callback` OAuth 콜백
- `/live-translation` 실시간 통역(데모)

## 환경 변수(.env)
다음 키를 개발/프로덕션 환경에 설정하세요.

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

VITE_KAKAO_CLIENT_ID=...
VITE_KAKAO_CLIENT_SECRET=...
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/kakao-callback

VITE_GOOGLE_MAPS_API_KEY=...
```

- 로컬: `.env.development` 사용 가능
- 배포: Vercel 프로젝트의 Environment Variables(Production/Preview)에 동일 키를 등록

## 실행 방법(로컬 개발)
1) 의존성 설치
```bash
npm i
```

2) 개발 서버 실행
```bash
npm run dev
```

3) 빌드 확인(선택)
```bash
npm run build
```

## Supabase 준비
1) 프로젝트 생성 후 `Project URL`, `anon` 키를 확보하여 환경 변수에 입력
2) Auth 설정
   - Site URL: 프로덕션 도메인(e.g. `https://<your-domain>`)
   - Redirect URLs: `http://localhost:5173/kakao-callback`, `https://<your-domain>/kakao-callback`
3) OAuth Provider
   - Google: Client ID/Secret 등록, Authorized redirect URIs에 위 Redirect URL 추가
   - Kakao: REST API 키/Secret 등록, Redirect URL 동일하게 등록

## 데이터베이스 스키마/시드(필수)
`places`/`locations` 테이블과 RLS 정책, 목데이터(30+ 항목)를 한 번에 생성하는 SQL을 Supabase SQL Editor에서 실행하세요.

- 생성 개요
  - Enums: `activity_level`(`LIGHT|MODERATE|INTENSE`), `skill_level`(`BEGINNER|INTERMEDIATE|ADVANCED`)
  - Tables: `public.places`, `public.locations`
  - RLS: 공개 읽기(SELECT), 인증 사용자 쓰기/관리(ALL)
  - Seed: 10개 장소 + 30개 체험 레코드

예시(요약):
```sql
-- Extensions
create extension if not exists pgcrypto;

-- Enums
DO $$ BEGIN CREATE TYPE activity_level AS ENUM ('LIGHT','MODERATE','INTENSE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE skill_level AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tables(요약)
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  city text not null,
  district text,
  postal_code text,
  address_line text,
  place_label text unique,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tagline text,
  image_url text not null,
  price_krw integer not null,
  activity_level activity_level not null,
  skill_level skill_level not null,
  max_guests_total integer not null,
  min_age integer,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.places enable row level security;
alter table public.locations enable row level security;
DO $$ BEGIN CREATE POLICY "public can read places" ON public.places FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth can manage places" ON public.places FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "public can read locations" ON public.locations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth can manage locations" ON public.locations FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
```

> 참고: 저장소에 `supabase_seed.sql` 파일이 없을 수 있습니다. 위 개요를 참고해 SQL Editor에 전체 스크립트를 붙여 실행하세요.

## 프론트엔드 데이터 연동
- Supabase SDK 초기화: `src/supabase.ts`
- 위치/체험 목록: `src/routes/locations.tsx`가 DB에서 `places`, `locations`를 읽어 지도+리스트로 렌더링
  - 지도 가격 태그: 검은색 배경/흰색 텍스트
  - 리스트/그리드 전환 버튼: 테두리/호버/포커스 개선
  - 지도/리스트 폭: 세로 리사이저로 400–640px 구간에서 가변 조절(지도 확장 시 전체 화면)

## 배포(Vercel)
사전 준비: Vercel CLI 로그인(`vercel login`), 프로젝트 연결

- SPA 라우팅: 루트에 `vercel.json` 존재해야 함
```json
{
  "rewrites": [ { "source": "/(.*)", "destination": "/index.html" } ]
}
```

- 스크립트(예):
```bash
npm run predeploy   # Vite 빌드(dist)
npm run deploy      # vercel build --prod && vercel deploy --prebuilt --prod --yes || vercel --prod
```

- Vercel 프로젝트 설정
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Root Directory: (비워두기; 저장소 루트 사용)
  - Environment Variables(Production/Preview): 위 VITE_* 키 추가

> 주의: 원격 빌드를 사용해야(Vercel이 빌드) 환경변수가 빌드 산출물에 주입됩니다. 필요 시 `vercel --prod`로 원격 빌드를 강제하세요.

## 문제 해결(Troubleshooting)
- "Uncaught Error: supabaseUrl is required."
  - 원인: Vercel 환경변수 미설정 또는 로컬 사전 빌드 산출물 사용으로 주입 실패
  - 조치: Vercel의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 설정하고 `vercel --prod`로 재배포

- 배포 후 빈 화면/404
  - `vercel.json`이 루트에 있는지 확인(SPA rewrite)
  - Output Directory가 `dist`인지 확인
  - 프로젝트 Alias가 최신 배포를 가리키는지 확인
  - 브라우저 캐시 강제 새로고침(Shift+Reload)

- `/locations` 데이터가 비어 있음
  - Supabase SQL 시드가 실행되었는지 확인(places/locations 레코드 수)
  - RLS 정책이 SELECT 허용하는지 확인
  - 콘솔 로그에 Supabase fetch 에러가 없는지 확인

- OAuth 로그인 불가
  - Supabase Auth의 Site URL/Redirect URL이 로컬/프로덕션에 맞게 모두 등록되었는지 확인
  - Kakao/Google 콘솔의 Redirect URL과 일치하는지 재확인

## 폴더 구조(요약)
```
src/
  components/ (레이아웃, GNB, ProtectedRoute 등)
  routes/ (home, locations, profile, sign_in, sign_up, kakao_callback ...)
  i18n/
  supabase.ts          # Supabase 클라이언트
public/
dist/                  # 빌드 산출물
vercel.json            # SPA 리라이트
```

## 마이그레이션 참고(요약)
- Firebase → Supabase로 전환(Auth/Storage/DB)
- Firebase Data Connect, Hosting 등은 더 이상 사용하지 않음
- 아바타 업로드: Supabase Storage `avatars` 버킷 사용
- 클라이언트 상태: `supabase.auth.getSession()`, `onAuthStateChange` 사용

## 보안 주의
- `anon key`만 프론트엔드에 노출합니다. 서비스 로직상 서버 키는 사용하지 않습니다.
- OAuth Redirect URL은 반드시 HTTPS(프로덕션)로 설정하세요.
