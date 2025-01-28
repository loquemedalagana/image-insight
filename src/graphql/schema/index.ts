import { gql } from 'apollo-server-micro';

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
  }
`;
