import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '@/graphql/testServer';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
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

export type Gps = {
  __typename?: 'GPS';
  latitude: Maybe<Scalars['Float']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
};

export type Metadata = {
  __typename?: 'Metadata';
  category: Scalars['String']['output'];
  exif: Maybe<ExifData>;
  fileName: Scalars['String']['output'];
  format: Maybe<Scalars['String']['output']>;
  height: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  size: Maybe<Scalars['Int']['output']>;
  width: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMetadata: Maybe<Metadata>;
  deleteById: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAddMetadataArgs = {
  category: Scalars['String']['input'];
  filePath: Scalars['String']['input'];
};


export type MutationDeleteByIdArgs = {
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  metadata: Array<Metadata>;
  metadataById: Maybe<Metadata>;
};


export type QueryMetadataByIdArgs = {
  id: Scalars['ID']['input'];
};

export type DeleteMetadataByIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMetadataByIdMutation = { __typename?: 'Mutation', deleteById: boolean | null };

export type GetMetadataByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMetadataByIdQuery = { __typename?: 'Query', metadataById: { __typename?: 'Metadata', id: string, fileName: string, category: string } | null };

export type GetMetadataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMetadataQuery = { __typename?: 'Query', metadata: Array<{ __typename?: 'Metadata', id: string, fileName: string, category: string, width: number | null, height: number | null, format: string | null, size: number | null, exif: { __typename?: 'ExifData', make: string | null, model: string | null } | null }> };



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
  ExifData: ResolverTypeWrapper<Partial<ExifData>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  GPS: ResolverTypeWrapper<Partial<Gps>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  Metadata: ResolverTypeWrapper<Partial<Metadata>>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Partial<Scalars['Boolean']['output']>;
  ExifData: Partial<ExifData>;
  Float: Partial<Scalars['Float']['output']>;
  GPS: Partial<Gps>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  Metadata: Partial<Metadata>;
  Mutation: {};
  Query: {};
  String: Partial<Scalars['String']['output']>;
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

export type MetadataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']> = {
  category: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  addMetadata: Resolver<Maybe<ResolversTypes['Metadata']>, ParentType, ContextType, RequireFields<MutationAddMetadataArgs, 'category' | 'filePath'>>;
  deleteById: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteByIdArgs, 'id'>>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  metadata: Resolver<Array<ResolversTypes['Metadata']>, ParentType, ContextType>;
  metadataById: Resolver<Maybe<ResolversTypes['Metadata']>, ParentType, ContextType, RequireFields<QueryMetadataByIdArgs, 'id'>>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  ExifData: ExifDataResolvers<ContextType>;
  GPS: GpsResolvers<ContextType>;
  Metadata: MetadataResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};

