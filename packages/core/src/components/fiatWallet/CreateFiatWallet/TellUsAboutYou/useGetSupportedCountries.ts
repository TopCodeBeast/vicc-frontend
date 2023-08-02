import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';
import { toDisplayName } from '@core/lib/territories';

import {
  GetSupportedCountriesQuery,
  GetSupportedCountriesQueryVariables,
} from './__generated__/useGetSupportedCountries.graphql';

const GET_SUPPORTED_COUNTRIES_QUERY = gql`
  query GetSupportedCountriesQuery {
    config {
      id
      fiatWalletCountries {
        id
        slug
        code
      }
    }
  }
` as TypedDocumentNode<
  GetSupportedCountriesQuery,
  GetSupportedCountriesQueryVariables
>;

const useGetSupportedCountries = () => {
  const { data, loading } = useQuery(GET_SUPPORTED_COUNTRIES_QUERY);

  return {
    supportedCountries:
      data?.config?.fiatWalletCountries
        ?.filter(Boolean)
        ?.sort((a, b) =>
          toDisplayName(a.code).localeCompare(toDisplayName(b.code))
        ) || [],
    loading,
  };
};

export default useGetSupportedCountries;
