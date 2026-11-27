import { Kind, ObjectTypeDefinitionNode } from 'graphql';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';

// 스키마(types.graphql)의 Query/Mutation 필드와 resolver 구현이 어긋나지 않게 막는 테스트.
// 스키마에만 있고 resolver가 없는 필드는 호출하면 null만 돌려주기 때문에 눈에 잘 띄지 않는다.
const fieldsOf = (typeName: 'Query' | 'Mutation'): string[] =>
  typeDefs.definitions
    .filter(
      (definition): definition is ObjectTypeDefinitionNode =>
        definition.kind === Kind.OBJECT_TYPE_DEFINITION &&
        definition.name.value === typeName,
    )
    .flatMap((definition) => definition.fields ?? [])
    .map((field) => field.name.value)
    .sort();

describe('schema and resolvers', () => {
  it.each(['Query', 'Mutation'] as const)(
    'every %s field in the schema has a resolver, and nothing extra',
    (typeName) => {
      const schemaFields = fieldsOf(typeName);
      const resolverFields = Object.keys(resolvers[typeName]).sort();

      expect(schemaFields.length).toBeGreaterThan(0);
      expect(resolverFields).toEqual(schemaFields);
    },
  );
});
