import { TypedDocumentNode, gql } from '@apollo/client';
import {
  Navigate,
  generatePath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import VerifyPhoneNumber from '@sorare/core/src/components/user/VerifyPhoneNumber';
import {
  FOOTBALL_COMPOSE_TEAM,
  FOOTBALL_COMPOSE_TEAM_LINEUP,
  FOOTBALL_HOME,
  FOOTBALL_LOBBY,
  FOOTBALL_PLAY_WEEKLY,
  FOOTBALL_SCARCITIES,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import useNavigateWithDeeplink from '@sorare/core/src/hooks/useNavigateWithDeeplink';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';

import ComposeTeamComponent from '@football/components/so5/ComposeTeam';
import { emptyLineup, isBlockchainLeague } from '@football/lib/so5';
import { RouteState } from '@football/types/routes';

import {
  ComposeTeamLeaderboardQuery,
  ComposeTeamLeaderboardQueryVariables,
  ComposeTeamQuery,
  ComposeTeamQueryVariables,
} from './__generated__/index.graphql';

const COMPOSE_TEAM_LEADERBOARD_QUERY = gql`
  query ComposeTeamLeaderboardQuery($vicc5LeaderboardSlug: String!) {
    #football {
      vicc5Root {
        vicc5Leaderboard(slug: $vicc5LeaderboardSlug) {
          slug
          trainingCenter
          vicc5League {
            slug
            name
          }
          vicc5Fixture {
            slug
            myVicc5LineupsPaginated(
              vicc5LeaderboardSlug: $vicc5LeaderboardSlug
              first: 1
            ) {
              nodes {
                id
              }
            }
          }
        }
      }
    #}
  }
` as TypedDocumentNode<
  ComposeTeamLeaderboardQuery,
  ComposeTeamLeaderboardQueryVariables
>;
const COMPOSE_TEAM_QUERY = gql`
  query ComposeTeamQuery(
    $vicc5LeaderboardSlug: String!
    $vicc5LineupId: String
    $statsView: Boolean!
  ) {
    #football {
      vicc5Root {
        vicc5Leaderboard(slug: $vicc5LeaderboardSlug) {
          slug
          vicc5League {
            slug
            name
            ...isBlockchainLeague_vicc5League
          }
          vicc5Lineup(id: $vicc5LineupId) {
            id
            ...ComposeTeamComponent_vicc5Lineup
          }
          ...ComposeTeamComponent_vicc5Leaderboard
        }
      }
    #}
  }
  ${ComposeTeamComponent.fragments.vicc5Leaderboard}
  ${ComposeTeamComponent.fragments.vicc5Lineup}
  ${isBlockchainLeague.fragments.vicc5League}
` as TypedDocumentNode<ComposeTeamQuery, ComposeTeamQueryVariables>;

type Props = {
  vicc5LeaderboardSlug: string;
  vicc5LineupId?: string;
};

export const ComposeTeam = ({ vicc5LeaderboardSlug, vicc5LineupId }: Props) => {
  const navigateWithDeeplink = useNavigateWithDeeplink();
  const navigate = useNavigate();
  const location = useLocation();
  const generatePathWithSearch = useGeneratePathWithSearch();
  const goBack = useSafePreviousNavigate(FOOTBALL_HOME);
  const isReorgApp = useIsReorgApp();

  const { data, loading } = useQuery(COMPOSE_TEAM_QUERY, {
    variables: {
      vicc5LeaderboardSlug: vicc5LeaderboardSlug || '',
      vicc5LineupId,
      statsView: false,
    },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  if (!data) {
    if (loading) {
      return <LoadingIndicator fullScreen />;
    }
    return <Navigate to={isReorgApp ? FOOTBALL_PLAY_WEEKLY : FOOTBALL_LOBBY} />;
  }

  const { vicc5Leaderboard } = data.vicc5Root;
  const { vicc5Lineup, vicc5League } = vicc5Leaderboard || {};

  const handleSubmitSuccess = (captainPictureUrl?: string) => {
    const { context } =
      (location.state as RouteState[typeof FOOTBALL_COMPOSE_TEAM]) || {};
    if (context === 'postDraft') {
      navigateWithDeeplink(FOOTBALL_HOME);
    } else if (context === 'onboarding') {
      navigate(generatePathWithSearch(FOOTBALL_SCARCITIES), {
        state: {
          commonCardPictureUrl: captainPictureUrl || '',
        },
      });
    } else {
      goBack();
    }
  };

  const props = {
    onClose: goBack,
    onSubmitSuccess: handleSubmitSuccess,
    vicc5Fixture: vicc5Leaderboard.vicc5Fixture,
    vicc5Lineup: vicc5Lineup || emptyLineup,
    vicc5Leaderboard: vicc5Leaderboard!,
  };

  return (
    <>
      {vicc5League && isBlockchainLeague(vicc5League) && <VerifyPhoneNumber />}
      <ComposeTeamComponent {...props} />
    </>
  );
};

const ComposeTeamOrRedirect = () => {
  const { vicc5LeaderboardSlug = '', vicc5LineupId } = useParams();

  const { data: leaderboardData, loading } = useQuery(
    COMPOSE_TEAM_LEADERBOARD_QUERY,
    {
      variables: {
        vicc5LeaderboardSlug,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const { vicc5Leaderboard } = leaderboardData?.vicc5 || {};
  const { vicc5Fixture, trainingCenter } = vicc5Leaderboard || {};
  const { myVicc5LineupsPaginated } = vicc5Fixture || {};
  const firstValidLineupId = idFromObject(
    myVicc5LineupsPaginated?.nodes?.[0]?.id
  );
  const navigateToValidLineup =
    firstValidLineupId && firstValidLineupId !== vicc5LineupId && !trainingCenter;

  if (!leaderboardData && loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (navigateToValidLineup) {
    return (
      <Navigate
        to={generatePath(FOOTBALL_COMPOSE_TEAM_LINEUP, {
          vicc5LeaderboardSlug,
          vicc5LineupId: firstValidLineupId,
        })}
        replace
      />
    );
  }

  return (
    <ComposeTeam
      vicc5LeaderboardSlug={vicc5LeaderboardSlug}
      vicc5LineupId={vicc5LineupId}
    />
  );
};

export default ComposeTeamOrRedirect;
