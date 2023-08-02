import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  NextSo5FixtureTeams,
  NextSo5FixtureTeamsVariables,
} from './__generated__/useNextSo5FixtureTeams.graphql';

const QUERY = gql`
  query NextSo5FixtureTeams {
    config {
      id
      so5 {
        id
        nextSo5FixtureTeams {
          ... on TeamInterface {
            slug
          }
        }
      }
    }
  }
` as TypedDocumentNode<NextSo5FixtureTeams, NextSo5FixtureTeamsVariables>;

export default () => {
  const { data, loading } = useQuery(QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return {
    nextSo5FixtureTeams: data?.config?.so5?.nextSo5FixtureTeams || [],
    loading,
  };
};
