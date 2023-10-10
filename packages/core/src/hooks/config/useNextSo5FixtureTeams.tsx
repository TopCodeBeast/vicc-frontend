import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  NextVicc5FixtureTeams,
  NextVicc5FixtureTeamsVariables,
} from './__generated__/useNextSo5FixtureTeams.graphql';

const QUERY = gql`
  query NextVicc5FixtureTeams {
    config {
      id
      vicc5Config {
        id
        nextVicc5FixtureTeams {
          ... on TeamInterface {
            slug
          }
        }
      }
    }
  }
` as TypedDocumentNode<NextVicc5FixtureTeams, NextVicc5FixtureTeamsVariables>;

export default () => {
  const { data, loading } = useQuery(QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return {
    nextVicc5FixtureTeams: data?.config?.vicc5?.nextVicc5FixtureTeams || [],
    loading,
  };
};
