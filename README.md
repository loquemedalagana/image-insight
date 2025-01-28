# 프로젝트: 이미지 메타데이터 분석 도구

## 프로젝트 개요

이 프로젝트는 **이미지 메타데이터 추출 및 관리**를 목표로 하며, JPG 파일을 중심으로 확장 가능한 시스템을 제공합니다. 사용자는 이미지 목록을 확인하고 메타데이터를 추출/분석하며, 추후 얼굴 인식 및 분류 기능, 그리고 2D에서 3D로 확장하는 기능까지 구현할 계획입니다.

---

## 📋 주요 기능

### 1. 현재 기능

- **이미지 메타데이터 추출**: JPG 파일 리스트에서 촬영 시간, 카메라 모델 등의 메타데이터를 추출.
- **Git LFS 활용**: 프로젝트 초기 단계에서 Git LFS를 이용하여 이미지 파일 관리.

### 2. 확장 기능 (계획)

- **이미지 저장**:
  - 클라우드 스토리지: Backblaze 또는 Wasabi를 사용하여 최대 10TB까지 확장 가능.
- **데이터 시각화**:
  - Next.js + React를 활용해 이미지 목록과 상세 UI 제공.
  - WebGPU/WebGL을 이용한 이미지 전처리 및 분석.
- **메타데이터 기반 필터링**:
  - 카메라 모델, 촬영 시간, 인물 등을 기준으로 이미지 필터링.
- **이미지 분류 및 처리**:
  - **face-api.js**를 활용한 얼굴 인식.
  - **TensorFlow.js**로 브라우저 기반 이미지 분류.
  - **Sharp**을 사용해 서버에서 이미지 리사이징 및 썸네일 생성.
  - WebAssembly로 CR3 포맷 확장 지원.
- **UI 구성**:
  - 갤러리 형태의 UI.
  - 분류 결과를 시각화(예: 그래프 기반).

### 3. 장기 확장 계획

- **2D -> 3D 전환**:
  - RTX 4090 또는 5090 PC로 업그레이드 후, 로컬에서 학습해 3D 결과물을 생성.

---

## 🔧 기술 스택

### 프론트엔드

- **Next.js**: 데이터 시각화 및 UI 구성.
- **React**: 갤러리와 필터링 UI 제공.
- **WebGPU/WebGL**: 이미지 전처리 및 분석.

### 백엔드

- **Node.js**: API 및 클라우드 스토리지 연동.
- **MongoDB**: 이미지 메타데이터 관리.
- **Neo4j**: 인물 분류 및 관계형 데이터 분석.

### 클라우드 스토리지

- **Backblaze B2** 또는 **Wasabi**: 대용량 이미지 파일 저장.

---

## 🚀 설치 및 실행 방법

### 1. 클론

```bash
git clone https://github.com/image-insight.git
cd image-insight
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 이미지 파일 관리

- **Git LFS 활성화**:
  ```bash
  git lfs install
  git lfs track "*.jpg"
  ```
- **JPG 파일 업로드**:
  프로젝트의 `assets/images` 디렉토리에 파일 저장.

---

## 📌 사용 예시

- 이미지를 업로드하고 메타데이터를 추출.
- 메타데이터 기반으로 이미지 목록을 필터링.
- 브라우저 기반 얼굴 인식 및 분류.

---

## 📈 향후 개발 로드맵

1. 클라우드 스토리지와 API 연동 완료.
2. GraphQL로 데이터 관리 시스템 구축.
3. WebGPU 기반 컬러 분석 및 이미지 전처리 기능 추가.
4. 3D 이미지 출력 및 시각화 시스템 개발.

---

# Project: Image Metadata Analysis Tool

## Project Overview

This project aims to **extract and manage image metadata**, focusing on a scalable system for JPG files. Users can view image lists, extract/analyze metadata, implement facial recognition and classification, and eventually expand to 3D visualization.

---

## 📋 Key Features

### 1. Current Features

- **Metadata Extraction**: Extract metadata such as capture time and camera model from JPG file lists.
- **Git LFS Support**: Manage image files using Git LFS in the initial project phase.

### 2. Planned Features

- **Image Storage**:
  - Use Backblaze or Wasabi cloud storage, scalable up to 10TB.
- **Data Visualization**:
  - Provide image lists and detailed UI using Next.js + React.
  - Perform image preprocessing and analysis with WebGPU/WebGL.
- **Filtering by Metadata**:
  - Filter images by camera model, capture time, and individuals.
- **Image Classification and Processing**:
  - Facial recognition with **face-api.js**.
  - Image classification using **TensorFlow.js**.
  - Resize and create thumbnails using **Sharp**.
  - Extend support for CR3 format with WebAssembly.
- **UI Features**:
  - Gallery-style UI.
  - Visualization of classification results (e.g., graphs).

### 3. Long-Term Expansion Plan

- **2D to 3D Transition**:
  - Upgrade to RTX 4090 or 5090 PC for local training and generating 3D outputs.

---

## 🔧 Tech Stack

### Frontend

- **Next.js**: Data visualization and UI.
- **React**: Gallery and filtering UI.
- **WebGPU/WebGL**: Image preprocessing and analysis.

### Backend

- **Node.js**: API and cloud storage integration.
- **MongoDB**: Metadata management.
- **Neo4j**: Classification and relational data analysis.

### Cloud Storage

- **Backblaze B2** or **Wasabi**: For large-scale image file storage.

---

## 🚀 Setup and Run

### 1. Clone Repository

```bash
git clone https://github.com/image-insight.git
cd image-insight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Manage Image Files

- **Enable Git LFS**:
  ```bash
  git lfs install
  git lfs track "*.jpg"
  ```
- **Upload JPG Files**:
  Save files in the `assets/images` directory of the project.

---

## 📌 Example Use Cases

- Upload images and extract metadata.
- Filter images based on metadata.
- Perform browser-based facial recognition and classification.

---

## 📈 Future Development Roadmap

1. Complete API integration with cloud storage.
2. Build a data management system using GraphQL.
3. Add color analysis and preprocessing with WebGPU.
4. Develop a 3D output visualization system.
