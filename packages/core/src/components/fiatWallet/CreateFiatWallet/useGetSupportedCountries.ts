import { gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';
import { toDisplayName } from '@core/lib/territories';

import { GetSupportedCountriesQuery } from './__generated__/useGetSupportedCountries.graphql';

const GET_SUPPORTED_COUNTRIES_QUERY = gql`
  query GetSupportedCountriesQuery {
    config {
      id
      fiatWalletCountries {
        id
        slug
        code
        flagUrl: flagUrl(size: 32)
      }
    }
  }
`;

const useGetSupportedCountries = () => {
  const { data, loading } = useQuery<GetSupportedCountriesQuery>(
    GET_SUPPORTED_COUNTRIES_QUERY
  );

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
