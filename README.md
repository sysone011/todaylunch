# todaylunch
점심 맛집 추천 앱
회사 주변의 맛집을 AI가 추천해주는 웹 애플리케이션입니다.

## 기능
- 사용자의 기분과 선호도를 반영한 맛집 추천
- Google Maps API를 활용한 주변 맛집 검색
- OpenAI GPT-4를 활용한 개성있는 추천 생성
- 모바일 친화적인 UI/UX

## 기술 스택
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- Google Maps API

## 시작하기

### 저장소 클론
```bash
git clone [repository-url]
cd todaylunch
```

### 의존성 설치
```bash
npm install
```

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드 및 배포
```bash
npm run build
npm start
```

## GitHub Pages 배포
1. GitHub 저장소의 Settings > Pages에서:
   - Source를 "GitHub Actions"로 설정
   - Branch를 "gh-pages"로 설정

2. GitHub 저장소의 Settings > Secrets and variables > Actions에서:
   - `OPENAI_API_KEY`와 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 환경 변수 설정

3. main 브랜치에 푸시하면 자동으로 배포됩니다.

## 라이선스
MIT 