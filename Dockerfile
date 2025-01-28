# Node.js 18 LTS 이미지를 기반으로
FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 프로젝트 소스 복사
COPY . .

# 포트 노출 (Next.js 기본 포트)
EXPOSE 3000

# 개발 서버 실행 (Next.js)
CMD ["npm", "run", "dev"]
