# Node.js 18 LTS 기반
FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json 및 lock 파일만 복사 (종속성 설치 단계 캐싱 최적화)
COPY package*.json ./

# 종속성 설치
RUN npm install

# 프로젝트 소스 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=development

# Next.js 포트 노출
EXPOSE 3000

# Next.js 개발 서버 실행
CMD ["npm", "run", "dev"]
