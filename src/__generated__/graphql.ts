import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '@/graphql/testServer';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type CameraExtrinsics = {
  __typename?: 'CameraExtrinsics';
  position: Array<Scalars['Float']['output']>;
  rotation: Array<Scalars['Float']['output']>;
};

export type CameraIntrinsics = {
  __typename?: 'CameraIntrinsics';
  focalLength: Scalars['Float']['output'];
  principalPoint: Array<Scalars['Float']['output']>;
  sensorHeight: Maybe<Scalars['Float']['output']>;
  sensorWidth: Maybe<Scalars['Float']['output']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ExifData = {
  __typename?: 'ExifData';
  dateTimeOriginal: Maybe<Scalars['String']['output']>;
  exposureTime: Maybe<Scalars['String']['output']>;
  fNumber: Maybe<Scalars['String']['output']>;
  focalLength: Maybe<Scalars['String']['output']>;
  gps: Maybe<Gps>;
  iso: Maybe<Scalars['Int']['output']>;
  make: Maybe<Scalars['String']['output']>;
  model: Maybe<Scalars['String']['output']>;
};

export enum FileFormat {
  Cr3 = 'CR3',
  Jpeg = 'JPEG'
}

export type Gps = {
  __typename?: 'GPS';
  latitude: Maybe<Scalars['Float']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
};

export type Metadata = {
  __typename?: 'Metadata';
  categories: Array<Category>;
  exif: Maybe<ExifData>;
  fileName: Scalars['String']['output'];
  format: Maybe<Scalars['String']['output']>;
  height: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  size: Maybe<Scalars['Int']['output']>;
  width: Maybe<Scalars['Int']['output']>;
};

export type MetadataSearchCondition = {
  categoryName: InputMaybe<Scalars['String']['input']>;
  fileFormat: InputMaybe<FileFormat>;
  fileName: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategory: Maybe<Category>;
  addMetadata: Maybe<Metadata>;
  deleteMetadataById: Maybe<Scalars['Boolean']['output']>;
  startNerfPreprocessing: Array<NeRfImage>;
  updateNerfImage: Maybe<NeRfImage>;
};


export type MutationAddCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationAddMetadataArgs = {
  categoryIds: Array<Scalars['ID']['input']>;
  filePath: Scalars['String']['input'];
};


export type MutationDeleteMetadataByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationStartNerfPreprocessingArgs = {
  input: NeRfPreprocessingInput;
};


export type MutationUpdateNerfImageArgs = {
  extrinsics: Array<Array<Scalars['Float']['input']>>;
  id: Scalars['ID']['input'];
  intrinsics: Array<Array<Scalars['Float']['input']>>;
  preprocessingStatus: InputMaybe<Scalars['String']['input']>;
};

export type NeRfImage = {
  __typename?: 'NeRFImage';
  extrinsics: Array<Array<Scalars['Float']['output']>>;
  id: Scalars['ID']['output'];
  intrinsics: Array<Array<Scalars['Float']['output']>>;
  metadata: Metadata;
  preprocessingStatus: Scalars['String']['output'];
  processedAt: Maybe<Scalars['String']['output']>;
};

export type NeRfPreprocessingInput = {
  algorithm: InputMaybe<Scalars['String']['input']>;
  imageIds: Array<Scalars['ID']['input']>;
  options: InputMaybe<Scalars['JSON']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getCategoryById: Maybe<Category>;
  getCategoryList: Array<Category>;
  metadata: Array<Metadata>;
  metadataById: Maybe<Metadata>;
  nerfImageById: Maybe<NeRfImage>;
  nerfImages: Array<NeRfImage>;
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMetadataArgs = {
  searchCondition: MetadataSearchCondition;
};


export type QueryMetadataByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNerfImageByIdArgs = {
  id: Scalars['ID']['input'];
};

export type DeleteMetadataByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMetadataByIdMutation = { __typename?: 'Mutation', deleteMetadataById: boolean | null };

export type GetMetadataByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMetadataByIdQuery = { __typename?: 'Query', metadataById: { __typename?: 'Metadata', id: string, fileName: string, imageUrl: string, categories: Array<{ __typename?: 'Category', name: string }>, exif: { __typename?: 'ExifData', make: string | null, model: string | null } | null } | null };

export type GetMetadataQueryVariables = Exact<{
  searchCondition: MetadataSearchCondition;
}>;


export type GetMetadataQuery = { __typename?: 'Query', metadata: Array<{ __typename?: 'Metadata', id: string, fileName: string, width: number | null, height: number | null, format: string | null, size: number | null, imageUrl: string, categories: Array<{ __typename?: 'Category', name: string }>, exif: { __typename?: 'ExifData', make: string | null, model: string | null } | null }> };

export type GetCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoryListQuery = { __typename?: 'Query', getCategoryList: Array<{ __typename?: 'Category', id: string, name: string }> };


export const DeleteMetadataByIdDocument = gql`
    mutation DeleteMetadataById($id: ID!) {
  deleteMetadataById(id: $id)
}
    `;
export type DeleteMetadataByIdMutationFn = Apollo.MutationFunction<DeleteMetadataByIdMutation, DeleteMetadataByIdMutationVariables>;

/**
 * __useDeleteMetadataByIdMutation__
 *
 * To run a mutation, you first call `useDeleteMetadataByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMetadataByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMetadataByIdMutation, { data, loading, error }] = useDeleteMetadataByIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMetadataByIdMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMetadataByIdMutation, DeleteMetadataByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMetadataByIdMutation, DeleteMetadataByIdMutationVariables>(DeleteMetadataByIdDocument, options);
      }
export type DeleteMetadataByIdMutationHookResult = ReturnType<typeof useDeleteMetadataByIdMutation>;
export type DeleteMetadataByIdMutationResult = Apollo.MutationResult<DeleteMetadataByIdMutation>;
export type DeleteMetadataByIdMutationOptions = Apollo.BaseMutationOptions<DeleteMetadataByIdMutation, DeleteMetadataByIdMutationVariables>;
export const GetMetadataByIdDocument = gql`
    query GetMetadataById($id: ID!) {
  metadataById(id: $id) {
    id
    fileName
    imageUrl
    categories {
      name
    }
    exif {
      make
      model
    }
  }
}
    `;

/**
 * __useGetMetadataByIdQuery__
 *
 * To run a query within a React component, call `useGetMetadataByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetadataByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetadataByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMetadataByIdQuery(baseOptions: Apollo.QueryHookOptions<GetMetadataByIdQuery, GetMetadataByIdQueryVariables> & ({ variables: GetMetadataByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMetadataByIdQuery, GetMetadataByIdQueryVariables>(GetMetadataByIdDocument, options);
      }
export function useGetMetadataByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMetadataByIdQuery, GetMetadataByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMetadataByIdQuery, GetMetadataByIdQueryVariables>(GetMetadataByIdDocument, options);
        }
export function useGetMetadataByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMetadataByIdQuery, GetMetadataByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMetadataByIdQuery, GetMetadataByIdQueryVariables>(GetMetadataByIdDocument, options);
        }
export type GetMetadataByIdQueryHookResult = ReturnType<typeof useGetMetadataByIdQuery>;
export type GetMetadataByIdLazyQueryHookResult = ReturnType<typeof useGetMetadataByIdLazyQuery>;
export type GetMetadataByIdSuspenseQueryHookResult = ReturnType<typeof useGetMetadataByIdSuspenseQuery>;
export type GetMetadataByIdQueryResult = Apollo.QueryResult<GetMetadataByIdQuery, GetMetadataByIdQueryVariables>;
export const GetMetadataDocument = gql`
    query GetMetadata($searchCondition: MetadataSearchCondition!) {
  metadata(searchCondition: $searchCondition) {
    id
    fileName
    categories {
      name
    }
    width
    height
    format
    size
    imageUrl
    exif {
      make
      model
    }
  }
}
    `;

/**
 * __useGetMetadataQuery__
 *
 * To run a query within a React component, call `useGetMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetadataQuery({
 *   variables: {
 *      searchCondition: // value for 'searchCondition'
 *   },
 * });
 */
export function useGetMetadataQuery(baseOptions: Apollo.QueryHookOptions<GetMetadataQuery, GetMetadataQueryVariables> & ({ variables: GetMetadataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMetadataQuery, GetMetadataQueryVariables>(GetMetadataDocument, options);
      }
export function useGetMetadataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMetadataQuery, GetMetadataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMetadataQuery, GetMetadataQueryVariables>(GetMetadataDocument, options);
        }
export function useGetMetadataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMetadataQuery, GetMetadataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMetadataQuery, GetMetadataQueryVariables>(GetMetadataDocument, options);
        }
export type GetMetadataQueryHookResult = ReturnType<typeof useGetMetadataQuery>;
export type GetMetadataLazyQueryHookResult = ReturnType<typeof useGetMetadataLazyQuery>;
export type GetMetadataSuspenseQueryHookResult = ReturnType<typeof useGetMetadataSuspenseQuery>;
export type GetMetadataQueryResult = Apollo.QueryResult<GetMetadataQuery, GetMetadataQueryVariables>;
export const GetCategoryListDocument = gql`
    query GetCategoryList {
  getCategoryList {
    id
    name
  }
}
    `;

/**
 * __useGetCategoryListQuery__
 *
 * To run a query within a React component, call `useGetCategoryListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoryListQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoryListQuery, GetCategoryListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoryListQuery, GetCategoryListQueryVariables>(GetCategoryListDocument, options);
      }
export function useGetCategoryListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryListQuery, GetCategoryListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoryListQuery, GetCategoryListQueryVariables>(GetCategoryListDocument, options);
        }
export function useGetCategoryListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoryListQuery, GetCategoryListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoryListQuery, GetCategoryListQueryVariables>(GetCategoryListDocument, options);
        }
export type GetCategoryListQueryHookResult = ReturnType<typeof useGetCategoryListQuery>;
export type GetCategoryListLazyQueryHookResult = ReturnType<typeof useGetCategoryListLazyQuery>;
export type GetCategoryListSuspenseQueryHookResult = ReturnType<typeof useGetCategoryListSuspenseQuery>;
export type GetCategoryListQueryResult = Apollo.QueryResult<GetCategoryListQuery, GetCategoryListQueryVariables>;


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  CameraExtrinsics: ResolverTypeWrapper<Partial<CameraExtrinsics>>;
  CameraIntrinsics: ResolverTypeWrapper<Partial<CameraIntrinsics>>;
  Category: ResolverTypeWrapper<Partial<Category>>;
  ExifData: ResolverTypeWrapper<Partial<ExifData>>;
  FileFormat: ResolverTypeWrapper<Partial<FileFormat>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  GPS: ResolverTypeWrapper<Partial<Gps>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']['output']>>;
  Metadata: ResolverTypeWrapper<Partial<Metadata>>;
  MetadataSearchCondition: ResolverTypeWrapper<Partial<MetadataSearchCondition>>;
  Mutation: ResolverTypeWrapper<{}>;
  NeRFImage: ResolverTypeWrapper<Partial<NeRfImage>>;
  NeRFPreprocessingInput: ResolverTypeWrapper<Partial<NeRfPreprocessingInput>>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Partial<Scalars['Boolean']['output']>;
  CameraExtrinsics: Partial<CameraExtrinsics>;
  CameraIntrinsics: Partial<CameraIntrinsics>;
  Category: Partial<Category>;
  ExifData: Partial<ExifData>;
  Float: Partial<Scalars['Float']['output']>;
  GPS: Partial<Gps>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  JSON: Partial<Scalars['JSON']['output']>;
  Metadata: Partial<Metadata>;
  MetadataSearchCondition: Partial<MetadataSearchCondition>;
  Mutation: {};
  NeRFImage: Partial<NeRfImage>;
  NeRFPreprocessingInput: Partial<NeRfPreprocessingInput>;
  Query: {};
  String: Partial<Scalars['String']['output']>;
};

export type CameraExtrinsicsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CameraExtrinsics'] = ResolversParentTypes['CameraExtrinsics']> = {
  position: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  rotation: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CameraIntrinsicsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CameraIntrinsics'] = ResolversParentTypes['CameraIntrinsics']> = {
  focalLength: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  principalPoint: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  sensorHeight: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sensorWidth: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExifDataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ExifData'] = ResolversParentTypes['ExifData']> = {
  dateTimeOriginal: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exposureTime: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  focalLength: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gps: Resolver<Maybe<ResolversTypes['GPS']>, ParentType, ContextType>;
  iso: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  make: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  model: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GpsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GPS'] = ResolversParentTypes['GPS']> = {
  latitude: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MetadataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']> = {
  categories: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  exif: Resolver<Maybe<ResolversTypes['ExifData']>, ParentType, ContextType>;
  fileName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  format: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  width: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCategory: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationAddCategoryArgs, 'name'>>;
  addMetadata: Resolver<Maybe<ResolversTypes['Metadata']>, ParentType, ContextType, RequireFields<MutationAddMetadataArgs, 'categoryIds' | 'filePath'>>;
  deleteMetadataById: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteMetadataByIdArgs, 'id'>>;
  startNerfPreprocessing: Resolver<Array<ResolversTypes['NeRFImage']>, ParentType, ContextType, RequireFields<MutationStartNerfPreprocessingArgs, 'input'>>;
  updateNerfImage: Resolver<Maybe<ResolversTypes['NeRFImage']>, ParentType, ContextType, RequireFields<MutationUpdateNerfImageArgs, 'extrinsics' | 'id' | 'intrinsics'>>;
};

export type NeRfImageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NeRFImage'] = ResolversParentTypes['NeRFImage']> = {
  extrinsics: Resolver<Array<Array<ResolversTypes['Float']>>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  intrinsics: Resolver<Array<Array<ResolversTypes['Float']>>, ParentType, ContextType>;
  metadata: Resolver<ResolversTypes['Metadata'], ParentType, ContextType>;
  preprocessingStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  processedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCategoryById: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryGetCategoryByIdArgs, 'id'>>;
  getCategoryList: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  metadata: Resolver<Array<ResolversTypes['Metadata']>, ParentType, ContextType, RequireFields<QueryMetadataArgs, 'searchCondition'>>;
  metadataById: Resolver<Maybe<ResolversTypes['Metadata']>, ParentType, ContextType, RequireFields<QueryMetadataByIdArgs, 'id'>>;
  nerfImageById: Resolver<Maybe<ResolversTypes['NeRFImage']>, ParentType, ContextType, RequireFields<QueryNerfImageByIdArgs, 'id'>>;
  nerfImages: Resolver<Array<ResolversTypes['NeRFImage']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  CameraExtrinsics: CameraExtrinsicsResolvers<ContextType>;
  CameraIntrinsics: CameraIntrinsicsResolvers<ContextType>;
  Category: CategoryResolvers<ContextType>;
  ExifData: ExifDataResolvers<ContextType>;
  GPS: GpsResolvers<ContextType>;
  JSON: GraphQLScalarType;
  Metadata: MetadataResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  NeRFImage: NeRfImageResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};

