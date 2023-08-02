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
  query ComposeTeamLeaderboardQuery($so5LeaderboardSlug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $so5LeaderboardSlug) {
          slug
          trainingCenter
          so5League {
            slug
            name
          }
          so5Fixture {
            slug
            mySo5LineupsPaginated(
              so5LeaderboardSlug: $so5LeaderboardSlug
              first: 1
            ) {
              nodes {
                id
              }
            }
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  ComposeTeamLeaderboardQuery,
  ComposeTeamLeaderboardQueryVariables
>;
const COMPOSE_TEAM_QUERY = gql`
  query ComposeTeamQuery(
    $so5LeaderboardSlug: String!
    $so5LineupId: String
    $statsView: Boolean!
  ) {
    football {
      so5 {
        so5Leaderboard(slug: $so5LeaderboardSlug) {
          slug
          so5League {
            slug
            name
            ...isBlockchainLeague_so5League
          }
          so5Lineup(id: $so5LineupId) {
            id
            ...ComposeTeamComponent_so5Lineup
          }
          ...ComposeTeamComponent_so5Leaderboard
        }
      }
    }
  }
  ${ComposeTeamComponent.fragments.so5Leaderboard}
  ${ComposeTeamComponent.fragments.so5Lineup}
  ${isBlockchainLeague.fragments.so5League}
` as TypedDocumentNode<ComposeTeamQuery, ComposeTeamQueryVariables>;

type Props = {
  so5LeaderboardSlug: string;
  so5LineupId?: string;
};

export const ComposeTeam = ({ so5LeaderboardSlug, so5LineupId }: Props) => {
  const navigateWithDeeplink = useNavigateWithDeeplink();
  const navigate = useNavigate();
  const location = useLocation();
  const generatePathWithSearch = useGeneratePathWithSearch();
  const goBack = useSafePreviousNavigate(FOOTBALL_HOME);
  const isReorgApp = useIsReorgApp();

  const { data, loading } = useQuery(COMPOSE_TEAM_QUERY, {
    variables: {
      so5LeaderboardSlug: so5LeaderboardSlug || '',
      so5LineupId,
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

  const { so5Leaderboard } = data.football.so5;
  const { so5Lineup, so5League } = so5Leaderboard || {};

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
    so5Fixture: so5Leaderboard.so5Fixture,
    so5Lineup: so5Lineup || emptyLineup,
    so5Leaderboard: so5Leaderboard!,
  };

  return (
    <>
      {so5League && isBlockchainLeague(so5League) && <VerifyPhoneNumber />}
      <ComposeTeamComponent {...props} />
    </>
  );
};

const ComposeTeamOrRedirect = () => {
  const { so5LeaderboardSlug = '', so5LineupId } = useParams();

  const { data: leaderboardData, loading } = useQuery(
    COMPOSE_TEAM_LEADERBOARD_QUERY,
    {
      variables: {
        so5LeaderboardSlug,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const { so5Leaderboard } = leaderboardData?.football.so5 || {};
  const { so5Fixture, trainingCenter } = so5Leaderboard || {};
  const { mySo5LineupsPaginated } = so5Fixture || {};
  const firstValidLineupId = idFromObject(
    mySo5LineupsPaginated?.nodes?.[0]?.id
  );
  const navigateToValidLineup =
    firstValidLineupId && firstValidLineupId !== so5LineupId && !trainingCenter;

  if (!leaderboardData && loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (navigateToValidLineup) {
    return (
      <Navigate
        to={generatePath(FOOTBALL_COMPOSE_TEAM_LINEUP, {
          so5LeaderboardSlug,
          so5LineupId: firstValidLineupId,
        })}
        replace
      />
    );
  }

  return (
    <ComposeTeam
      so5LeaderboardSlug={so5LeaderboardSlug}
      so5LineupId={so5LineupId}
    />
  );
};

export default ComposeTeamOrRedirect;
