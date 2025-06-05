# 점심 맛집 추천 앱

회사 주변의 맛집을 AI가 추천해주는 웹 애플리케이션입니다.

## 기능

- 사용자의 기분과 선호도를 반영한 맛집 추천
- 네이버 지도 API를 활용한 주변 맛집 검색
- OpenAI GPT-4를 활용한 개성있는 추천 생성
- 모바일 친화적인 UI/UX

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- Naver Search API

## 시작하기

1. 저장소 클론
```bash
git clone [repository-url]
cd lunch-recommender
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id_here
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_naver_client_secret_here
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 빌드 및 배포
```bash
npm run build
npm start
```

## AWS 배포

1. AWS Elastic Beanstalk CLI 설치
2. 프로젝트 루트에 `.elasticbeanstalk/config.yml` 파일 생성
3. 다음 명령어로 배포:
```bash
eb init
eb create
eb deploy
```

## 라이선스

MIT 