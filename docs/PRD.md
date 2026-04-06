# PRD (Product Requirements Document) - 마이링크 (MyLink)

**버전**: v1.3  
**최근 수정일**: 2026-04-06 (22:05)

## 1. 프로젝트 개요
- **프로젝트명**: 마이링크 (MyLink)
- **목적**: 사용자가 여러 링크를 하나의 통합된 프로필 페이지에서 관리하고 공유할 수 있게 해주는 개인화된 링크 공유 플랫폼.
- **대상 사용자**: 크리에이터, 프리랜서, 소상공인 등 링크 통합 관리가 필요한 모든 사용자.

## 2. 핵심 기능 목록

### 2-1. 필수 기능 (MVP)
- [ ] **회원가입 및 로그인 (인증)**: 이메일 가입 및 소셜 로그인 (Supabase Auth).
- [ ] **프로필 및 이름 관리**: 유저의 **username**과 **display_name** 설정 및 수정 가능.
- [ ] **display_name 기반 URL 주소**: `도메인.com/display_name` 형태로 고유 페이지 제공. (slug 역할 수행)
- [ ] **링크 리스트 관리 (CRUD)**: 링크 목적지 URL과 타이틀 관리.
- [ ] **인라인 편집 (Inline Editing)**: 대시보드 내에서 즉시 이름, 프로필 정보, 링크 정보를 수정.

### 2-2. 선택 기능 (Advanced)
- [ ] **소셜 아이콘 전용 위젯**: 인스타그램, 깃허브 등 전용 아이콘 배치.
- [ ] **방문자 통계**: 개별 링크의 클릭 조회수를 기록하고 제공.

## 3. 각 기능의 상세 설명

### 3-1. 회원가입 및 사용자 인증
- **display_name 자동 생성**: 구글 로그인(Gmail) 시 이메일 아이디의 앞부분(예: `user123@gmail.com` -> `user123`)을 추출하여 **display_name**의 초기값으로 자동 설정합니다.
- **고유성 체크**: **display_name**은 URL slug로 사용되므로 중복이 허용되지 않습니다.

### 3-2. 링크 및 프로필 관리 (어드민 대시보드)
- **제한 사항**: 이미지 업로드 기능은 제공하지 않습니다.
- **인라인 편집**: display_name, username, 링크의 타이틀과 URL은 입력 필드를 클릭하여 즉시 수정 가능합니다.
- **링크 아이콘**: 구글 파비콘 API를 사용하여 링크 입력 시 자동으로 호출합니다.

### 3-3. 퍼블릭 접속 페이지
- **display_name**을 조회하여 해당 사용자의 페이지를 렌더링합니다.

## 4. 기술 스택 및 데이터 모델링

### 4-1. 기술 스택
- **Backend/DB**: **Supabase**
- **Frontend**: **Next.js** (Tailwind CSS, Neobrutalism 스타일)

### 4-2. 데이터 모델링 (Supabase/PostgreSQL)

```sql
-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT UNIQUE NOT NULL, -- URL slug로 사용 (기본값: Gmail ID)
  username TEXT,                    -- 사용자의 실제 이름
  bio TEXT,                         -- 자기소개
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links Table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4-3. 전체 디자인 테마
- **소프트 네오브루탈리즘**: 파스텔톤 배경 + 굵은 검정 테두리 + 날카로운 그림자.

---

### 대시보드 디자인 목업
![Dashboard Mockup](./dashboard_mockup.png)

