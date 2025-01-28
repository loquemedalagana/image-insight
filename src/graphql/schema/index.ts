import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type GPS {
    latitude: Float
    longitude: Float
  }

  type ExifData {
    make: String
    model: String
    iso: Int
    exposureTime: String
    fNumber: String
    focalLength: String
    dateTimeOriginal: String
    gps: GPS
  }

  type Metadata {
    id: ID! # MongoDB ObjectId를 위한 필드 추가
    fileName: String!
    category: String!
    width: Int
    height: Int
    format: String
    size: Int
    exif: ExifData
  }

  type Query {
    metadata: [Metadata!]!
    metadataById(id: ID!): Metadata # 특정 id로 데이터 조회
  }

  type Mutation {
    deleteById(id: ID!): Boolean # 특정 id로 데이터 삭제
  }
`;
