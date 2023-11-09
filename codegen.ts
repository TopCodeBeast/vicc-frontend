import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: 'packages/**/!(__generated__)/*.{ts,tsx}',
  generates: {
    './packages/core/src/__generated__/globalTypes.ts': {
      plugins: ['typescript'],
      config: {
        avoidOptionals: false,
        namingConvention: 'keep',
        nonOptionalTypename: true,
        scalars: {
          WeiAmount: 'string',
        }
      },
    },
    'packages/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.graphql.ts',
        baseTypesPath: '~__generated__/globalTypes',
        folder: '__generated__',
      },
      plugins: ['typescript-operations'],
      config: {
        withHooks: true,
        avoidOptionals: false,
        namingConvention: 'keep',
        nonOptionalTypename: true,
        addUnderscoreToArgsType: false,
        exportFragmentSpreadSubTypes: true,
        omitOperationSuffix: true,
      },
    },
    './packages/core/src/__generated__/fragmentTypes.json': {
      plugins: ['fragment-matcher'],
    },
  },
};

export default config;
