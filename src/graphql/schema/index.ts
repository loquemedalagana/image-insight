import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-tag';

const schemaPath = path.join(process.cwd(), 'src/graphql/schema/types.graphql');
const typeDefsContent = fs.readFileSync(schemaPath, 'utf-8');

export const typeDefs = gql`
  ${typeDefsContent}
`;
