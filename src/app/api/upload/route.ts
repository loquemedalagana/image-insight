import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Next.js에서 bodyParser 비활성화
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

export default async function handler(req: any, res: any) {
  const form = formidable({
    uploadDir,
    keepExtensions: true, // 파일 확장자 유지
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload file' });
      return;
    }

    const uploadedFiles = files.file as formidable.File[] | formidable.File; // 단일 파일 또는 배열로 처리
    if (!uploadedFiles) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // 파일이 배열인 경우 첫 번째 파일을 사용
    const file = Array.isArray(uploadedFiles)
      ? uploadedFiles[0]
      : uploadedFiles;

    const filePath =
      file.filepath || // 최신 버전
      path.join(uploadDir, file.newFilename);

    // 업로드된 파일 정보 반환
    res.status(200).json({
      message: 'File uploaded successfully',
      filePath,
      category: fields.category || 'default', // 사용자 입력 또는 기본값
    });
  });
}
