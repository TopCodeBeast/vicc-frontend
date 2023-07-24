import { gql } from '@apollo/client';
import {
  Navigate,
  generatePath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
// import VerifyPhoneNumber from '@sorare/core/src/components/user/VerifyPhoneNumber';
import {
  FOOTBALL_COMPOSE_TEAM,
  FOOTBALL_COMPOSE_TEAM_LINEUP,
  FOOTBALL_HOME,
  FOOTBALL_LOBBY,
  FOOTBALL_SCARCITIES,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import useNavigateWithDeeplink from '@sorare/core/src/hooks/useNavigateWithDeeplink';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';

import ComposeTeamComponent from '@football/components/so5/ComposeTeam';
import { emptyLineup, isBlockchainLeague } from '@football/lib/so5';
import { RouteState } from '@football/types/routes';

import {
  ComposeTeamLeaderboardQuery,
  ComposeTeamQuery,
  ComposeTeamQueryVariables,
} from './__generated__/index.graphql';

const COMPOSE_TEAM_LEADERBOARD_QUERY = gql`
  query ComposeTeamLeaderboardQuery($vicc5LeaderboardSlug: String!) {
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $vicc5LeaderboardSlug) {
        slug
        trainingCenter
        so5League: vicc5League {
          slug
          name
        }
        so5Fixture: vicc5Fixture {
          slug
          mySo5LineupsPaginated: myVicc5LineupsPaginated(
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
  }
`;
const COMPOSE_TEAM_QUERY = gql`
  query ComposeTeamQuery(
    $vicc5LeaderboardSlug: String!
    $vicc5LineupId: String
    $statsView: Boolean!
  ) {
    so5: vicc5Root {
      vicc5Leaderboard(slug: $vicc5LeaderboardSlug) {
        slug
        so5League: vicc5League {
          slug
          name
          ...isBlockchainLeague_so5League
        }
        vicc5Lineup(id: $vicc5LineupId) {
          id
          ...ComposeTeamComponent_so5Lineup
        }
        ...ComposeTeamComponent_so5Leaderboard
      }
    }
  }
  ${ComposeTeamComponent.fragments.so5Leaderboard}
  ${ComposeTeamComponent.fragments.so5Lineup}
  ${isBlockchainLeague.fragments.so5League}
`;

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

  const { data, loading } = useQuery<
    ComposeTeamQuery,
    ComposeTeamQueryVariables
  >(COMPOSE_TEAM_QUERY, {
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
    return <Navigate to={FOOTBALL_LOBBY} />;
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
      {/* {so5League && isBlockchainLeague(so5League) && <VerifyPhoneNumber />} */}
      <ComposeTeamComponent {...props} />
    </>
  );
};

const ComposeTeamOrRedirect = () => {
  const {
    flags: { useSmartComposeTeamRedirection = false },
  } = useFeatureFlags();
  const { vicc5LeaderboardSlug = '', vicc5LineupId } = useParams();
  const { data: leaderboardData, loading } =
    useQuery<ComposeTeamLeaderboardQuery>(COMPOSE_TEAM_LEADERBOARD_QUERY, {
      variables: {
        vicc5LeaderboardSlug,
      },
      fetchPolicy: useSmartComposeTeamRedirection
        ? 'cache-and-network'
        : 'cache-only',
    });

  const { so5Leaderboard } = leaderboardData?.football.so5 || {};
  const { so5Fixture, trainingCenter } = so5Leaderboard || {};
  const { mySo5LineupsPaginated } = so5Fixture || {};
  const firstValidLineupId = idFromObject(
    mySo5LineupsPaginated?.nodes?.[0]?.id
  );
  const navigateToValidLineup =
    firstValidLineupId && firstValidLineupId !== vicc5LineupId && !trainingCenter;
  const navigateToEmptyComposeTeam = !firstValidLineupId && vicc5LineupId;

  if (!leaderboardData && loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (useSmartComposeTeamRedirection && navigateToValidLineup) {
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
  if (useSmartComposeTeamRedirection && navigateToEmptyComposeTeam) {
    return (
      <Navigate
        to={generatePath(FOOTBALL_COMPOSE_TEAM, {
          vicc5LeaderboardSlug,
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
