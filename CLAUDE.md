# image-insight

로컬 폴더의 JPG에서 이미지 정보(sharp)와 EXIF(exifr)를 추출해 GraphQL API로 제공하고, 카테고리 필터가 있는 갤러리로 보여 주는 Next.js 15 개인 프로젝트.

## 구현 범위

구현됨

- `public/samples` 폴더를 재귀 순회해 메타데이터(크기·포맷·용량·EXIF) 추출. 폴더 이름이 카테고리가 된다.
- GraphQL API(`/api/graphql`): `metadata`(카테고리·파일명 필터), `metadataById`, `getCategoryList`, `addMetadata`, `addCategory`, `deleteMetadataById`
- `/api/init-db`: 메타데이터를 읽어 DB를 초기화
- 메모리 mockDB(기본 저장소)
- 갤러리 화면: 서버 컴포넌트에서 Apollo Client로 조회, 카테고리 필터, masonry 목록
- Jest 테스트 4개 파일, Docker/Compose 개발 환경, GitHub Actions CI

계획만 있음(코드 없음 또는 스키마만 있음)

- MongoDB: `src/lib/mongoDB.ts`, `databaseManager.ts`에 어댑터 코드는 있지만 `isMongoConnected()`가 true가 되는 경로가 없어 실제로는 항상 mockDB를 쓴다. resolver는 `mockDatabase`를 직접 호출한다.
- NeRF 관련 타입/쿼리/뮤테이션(`nerfImages`, `startNerfPreprocessing` 등)과 `getCategoryById`: 스키마에만 있고 resolver가 없다.
- `src/utils/calibrationUtils.ts`: 뼈대만 있고 어디서도 호출하지 않는다.
- CR3 처리, 얼굴 인식(face-api.js), TensorFlow.js, 클라우드 스토리지(B2/Wasabi), Neo4j, WebGPU: 코드와 의존성 모두 없음.
- 업로드 UI, 인증, 배포: 없음.

## 명령어

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run lint      # next lint (ESLint flat config)
npm test          # Jest (ESM 모드)
npm run codegen   # GraphQL 타입·훅 생성 → src/__generated__/graphql.ts
```

- 화면은 `src/config.ts`의 `BASE_URL`로 자기 API를 호출한다. 기본값은 `http://localhost:3000`이고, 다른 포트·주소에서는 `NEXT_PUBLIC_BASE_URL`로 바꾼다.
- 테스트는 ESM 모드(`node --experimental-vm-modules`)로 돈다. `jest` 전역이 없으므로 `jest.fn`, `jest.spyOn` 등을 쓸 때는 `import { jest } from '@jest/globals'`로 가져온다. `describe`/`it`/`expect`는 전역 그대로 쓴다.
- 테스트는 `tests/setupEnv.ts`에서 `SAMPLES_DIR=tests/fixtures/samples`를 지정한다. fixture는 `node tests/fixtures/generate.mjs`로 다시 만들 수 있다.
- Node 버전: CI는 `.nvmrc`(20), Docker 이미지는 `node:18`.

## 폴더 구조

```
src/app/api/graphql/     Apollo Server를 Next.js Route Handler로 연결 (route.ts, server.ts)
src/app/api/init-db/     DB 초기화 엔드포인트
src/app/page.tsx         갤러리 페이지(서버 컴포넌트)
src/graphql/schema/      types.graphql (스키마 원본), index.ts (typeDefs 로더)
src/graphql/resolvers/   resolver
src/graphql/documents/   클라이언트용 query/mutation 문서(.graphql)
src/__generated__/       codegen 결과물 (직접 수정 금지)
src/lib/                 mockDB, mongoDB, databaseManager, initDatabase, processExif, extractMetadataFromLocal, apolloClient
src/utils/               fileUtils(디렉터리 순회), metadataUtils(sharp+EXIF 결합), calibrationUtils(미사용)
src/components/          CategoryFilter, MasonryImageList, 에러 컴포넌트
tests/api, tests/lib     Jest 테스트
tests/fixtures/          테스트 전용 이미지(LFS 아님)와 생성 스크립트
public/samples/          샘플 이미지 (Git LFS)
```

## GraphQL 규칙

- 스키마 우선: `src/graphql/schema/types.graphql`을 먼저 고치고 `npm run codegen`으로 `src/__generated__/graphql.ts`를 다시 만든다.
- `src/__generated__/` 아래 파일은 직접 고치지 않는다.
- 클라이언트에서 쓰는 쿼리는 `src/graphql/documents/*.graphql`에 추가하고 codegen이 만든 Document/훅을 쓴다.

## Git 규칙

- 기본 브랜치는 `develop`. Git flow: `feature/*` → `develop`.
- 커밋 메시지는 기존 스타일을 따른다: `- 소문자로 시작하는 짧은 영어 설명` (예: `- add masonry UI component`).
- **커밋 메시지와 PR 본문에 `Co-Authored-By: Claude` 같은 AI 공동 작성자 줄이나 "Generated with Claude Code" 문구를 넣지 않는다.** (`.claude/settings.json`의 `attribution`으로도 꺼 두었다.)
- push, force-push, 히스토리 재작성(rebase, filter-repo, BFG 등), 파일 삭제는 반드시 사용자 확인을 받은 뒤에 한다.

## Git LFS

- `*.jpg`, `*.jpeg`, `*.cr3`, `*.crw`는 LFS로 관리한다. 샘플은 `public/samples`에 있다.
- `tests/fixtures/**`는 `.gitattributes`에서 LFS 대상에서 제외했다.
- 샘플에는 인물 사진을 넣지 않는다. 새 샘플은 긴 변 2000px 이하로 줄이고 카메라·렌즈 일련번호, GPS, XMP를 제거한 뒤 추가한다(카메라·렌즈·노출·촬영일·저작권 표기는 유지).
- 테스트와 CI는 LFS 파일에 의존하지 않는다. CI checkout은 `lfs: false`다. 새 테스트도 `public/samples`가 아니라 `tests/fixtures`를 쓴다.

## 문서

- `README.md`(한국어)와 `README.en.md`(영어)는 항상 같이 수정한다.
- README에는 실제 코드에 있는 것만 "구현됨"으로 적는다. 계획은 "계획(미구현)"에 둔다.
- `retrospect.md`는 2025년 당시의 회고다. 사용자 승인 없이 고치지 않는다.

## 개발 이력

- 2025-01 ~ 2025-02: 원래 코드는 AI 도구 없이 1인 개발(커밋 82개).
- 2026-11 정리 작업부터 Claude Code를 사용한다(테스트 수정, CI, 문서 정리).
