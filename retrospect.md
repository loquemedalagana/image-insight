### 프로젝트 회고: 이미지 메타데이터 추출 프로젝트

이번 프로젝트는 이미지 메타데이터 추출을 목표로 진행되었으며, 간단한 기능 구현과 더불어 확장성을 고려한 설계를 중점적으로 작업했습니다. 아래는 프로젝트의 진행 내용과 성과, 개선점, 그리고 느낀 점입니다.

---

#### **1. 목표 및 동기**

- **프로젝트 목표**: 이미지 파일의 메타데이터를 안전하게 추출하고, GraphQL 기반 API를 설계하며 TDD(Test-Driven Development) 방식을 통해 안정성을 확보.
- **동기**:
  - 실무에서 적용하지 못했던 TDD를 개인 프로젝트에서 적극적으로 활용하여 안정적인 코드를 작성.
  - 프론트엔드 개발자로서 백엔드 작업 경험을 확장하고, GraphQL과 Docker에 대한 이해도를 높임.
  - 향후 그래픽스와 비전 분야로 진로를 전환하기 위한 기초 기술 습득.

---

#### **2. 진행 내용**

1. **데이터베이스 설계**:

   - MongoDB 대신 mockDB를 사용하여 확장성을 고려한 간단한 데이터베이스 구조를 구현.

2. **GraphQL API 설계**:

   - Apollo Server를 사용해 간단한 GraphQL API를 구축하였으며, 테스트 코드를 통해 예외 상황과 오류를 빠르게 발견하고 해결.

3. **Docker와 Docker Compose 학습**:

   - 로컬 Node.js 버전(22)과 배포 환경 Node.js 버전(18)의 차이를 고려해 Docker를 복습하며 환경을 통일.
   - 회사에서 QA 서버 마이그레이션 작업을 대비해 Docker Compose 사용 경험을 되살리며 실습 진행.

4. **경로 탐색과 데이터 전처리**:

   - 재귀 함수(`getAllImages`)를 활용해 단순 경로 탐색과 파일 목록 수집.
   - Generator를 사용하여 대량의 파일 데이터를 효율적으로 처리하고, mockDB에 적합한 데이터 전처리(`generateMetadata`)를 구현.
   - Sharp와 exifr 라이브러리를 결합해 메타데이터와 EXIF 데이터를 통합적으로 추출.

5. **기술적 도전**:

   - 회사 프로젝트에서 App Router를 성공적으로 도입한 경험을 바탕으로, 이번 프로젝트에서는 React 19와 Next.js 15를 활용하여 최신 기술 스택에 도전 예정.

6. **프론트엔드와의 연결**:
   - 현재 백엔드 작업만 완료했으며, Apollo Client 상태 관리와 프론트엔드 구현은 복습 대상.
   - Next.js API를 사용한 백엔드 작업이 프론트엔드의 연장선으로 볼 수 있는 점을 염두에 둠.

---

#### **3. 성과와 배운 점**

- **성과**:

  - TDD 방식을 도입하여 안정적인 GraphQL API를 구축.
  - Exif 데이터를 파싱하고, Exif 데이터가 없는 이미지에 대한 예외 처리 로직 작성.
  - Docker와 Docker Compose를 복습하며 배포 환경과 로컬 환경의 차이를 극복하는 방식을 학습.
  - Generator와 재귀를 조합하여 파일 경로 탐색과 데이터 전처리의 효율성을 높임.

- **배운 점**:

  1. Node.js 생태계가 빠르게 변화하고 있어, 지속적인 학습의 중요성을 다시 한번 느낌.
  2. GraphQL API 설계 시 데이터 구조의 일관성을 유지하는 것이 중요하며, 기존 실무에서의 비일관적인 스키마 설계를 반성하게 됨.
  3. mockDB와 간단한 데이터 설계를 통해 확장성을 염두에 둔 초반 설계의 중요성을 깨달음.
  4. 대량 데이터 처리와 비동기 작업에서 Generator와 Sharp를 활용한 효율적인 설계 방법론 학습.

- **안정적인 코드 작성 예시**:

```typescript
import fs from 'fs';
import path from 'path';
import { extractPhotoMetadata } from '@/utils/metadataUtils'; // Mock DB를 사용

const samplesDir = path.join(process.cwd(), 'public/samples');

// Generator를 사용하여 디렉토리를 탐색
function* walkDir(dir: string): Generator<string> {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      yield* walkDir(itemPath); // 하위 디렉토리 탐색
    } else if (stats.isFile() && /\.(jpe?g|JPE?G|cr3|CR3)$/i.test(item)) {
      yield itemPath; // 이미지 파일만 반환
    }
  }
}

// 디렉토리에서 모든 파일 메타데이터를 추출
export const extractMetadataFromLocal = async () => {
  const photos = [];

  for (const filePath of walkDir(samplesDir)) {
    try {
      const photo = await extractPhotoMetadata(filePath);
      photos.push(photo);
    } catch (error: any) {
      console.error(`Failed to process file: ${filePath}`, error.message);
      // 특정 파일에서 실패해도 전체 처리를 계속 진행
    }
  }

  return photos;
};
```

- 위 코드는 Generator를 활용하여 대량 파일 탐색에서 메모리 사용을 줄이고, 데이터를 효율적으로 처리할 수 있도록 설계되었습니다.

---

#### **4. 개선점**

1. **구조적 개선**:

   - 백엔드와 프론트엔드를 통합적으로 설계하고, 클린 아키텍처를 도입하여 유지보수성을 강화할 필요.

2. **기술 심화 학습**:

   - Apollo Client의 상태 관리 및 프론트엔드 기술 복습.
   - WebAssembly, WebGPU 등의 그래픽스와 비전 관련 기술 도입 준비.

3. **확장성 있는 설계**:
   - 현재는 JPG 파일만 지원하지만, CR3/CRW 파일과 같은 고난도 이미지 포맷 처리를 위한 추가 라이브러리 학습 필요.

---

#### **5. 느낀 점과 다짐**

- 이번 프로젝트를 통해 실무에서 부족했던 TDD, GraphQL, Docker에 대한 이해도를 높일 수 있었음.
- Apollo Server 설정 과정에서 레거시 코드와 충돌하며 어려움을 겪었지만, Node.js 생태계의 빠른 변화에 적응해야 한다는 교훈을 얻음.
- 중소 SI 환경에서의 한계를 느끼며, 그래픽스와 비전 분야로의 전환을 위한 의지를 더욱 다지게 됨.
- 새로운 기술에 도전하고, 개인 프로젝트를 통해 역량을 꾸준히 확장하며 앞으로 나아갈 계획.

---

### 결론

이번 프로젝트는 단순한 이미지 메타데이터 추출 작업이었지만, 새로운 기술 학습과 기존 기술 복습, 그리고 확장성을 고려한 설계에서 많은 성취를 얻었습니다. 앞으로도 이러한 학습과 도전을 통해 더 나은 개발자로 성장해 나갈 것입니다.
