import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import {
  AveragePlayerScore,
  Position as GlobalPosition,
} from '@sorare/core/src/__generated__/globalTypes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import { FOOTBALL_COMPOSE_TEAM_LINEUP } from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';
import useLocalStorageToggle from '@sorare/core/src/hooks/useLocalStorageToggle';
import {
  CamelCaseScarcity,
  Scarcity,
  isMyCardListedOnMarket,
  rarities,
} from '@sorare/core/src/lib/cards';
import { PlayablePosition as CardPositionType } from '@sorare/core/src/lib/players';
import { toCamelCase } from '@sorare/core/src/lib/toCamelCase';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import TeamAvatar from '@football/components/club/TeamAvatar';
// All rules are now display into the compose team and need to use the fragements
// to make them available in the composeTeam context
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { ComposeOnboarding } from '@football/components/onboarding/ComposeOnboarding';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import PlayerCurrentUnavailabilityBadge from '@football/components/player/PlayerCurrentUnavailabilityBadge';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import Context, {
  BenchFilters,
  Errors,
} from '@football/components/so5/ComposeTeam/Context';
import { MAX_CARD_VALUE } from '@football/components/so5/ComposeTeam/responsive/BenchFilter/FilterContent';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import LineupCard from '@football/components/so5/ComposeTeam/responsive/LineupCard';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import Rules from '@football/components/so5/Rules';
import useCreateOrUpdateLineup from '@football/hooks/so5/useCreateOrUpdateLineup';
import {
  EditableLineup,
  FormationName,
  Position,
  emptyAppearance,
  emptyLineup,
  formationFromExtraPlayerPosition,
  getAppearancesByPosition,
  getPositionSelectionOrder,
} from '@football/lib/so5';

import {
  ContextProvider_card,
  ContextProvider_vicc5Leaderboard,
  ContextProvider_vicc5Lineup,
} from './__generated__/index.graphql';
import useShowAffordableOnly from './useShowAffordableOnly';

type ContextProvider_vicc5Lineup_vicc5Appearances =
  ContextProvider_vicc5Lineup['vicc5Appearances'][number];

type ContextProvider_vicc5Lineup_vicc5Appearances_card =
  ContextProvider_vicc5Lineup_vicc5Appearances['card'];

export interface Vicc5ComposeLineupProps {
  onClose: () => void;
  onSubmitSuccess: (captainPictureUrl?: string) => void;
  vicc5Leaderboard: ContextProvider_vicc5Leaderboard;
  vicc5Lineup: ContextProvider_vicc5Lineup;
  onboarding?: boolean;
  children?: React.ReactNode;
}

const ContextProvider = ({
  onClose,
  onSubmitSuccess,
  vicc5Leaderboard,
  vicc5Lineup,
  onboarding = false,
  children,
}: Vicc5ComposeLineupProps) => {
  const { vicc5Appearances } = vicc5Lineup;

  const showFilters = !onboarding;
  const fifteenGameAverageTotalLimit = vicc5Leaderboard.rules?.sumOfAverageScores;
  const isCappedMode = !!fifteenGameAverageTotalLimit;
  const isReorgApp = useIsReorgApp();
  const initialFilters: BenchFilters = {
    includeNoGameCards: !showFilters,
    includeUsedCards: !showFilters,
    ...(isCappedMode
      ? {
          lastFifteenVicc5AverageScore: {
            min: 0,
            max: MAX_CARD_VALUE,
          },
        }
      : {}),
  };
  const [playerDetails, setPlayerDetails] = useState<{
    slug: string;
    pictureUrl: string | null;
    card?: ContextProvider_card;
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>();
  const [filters, setFilters] = useState<BenchFilters>(initialFilters);
  const [activePosition, setActivePosition] = useState<Position>(
    GlobalPosition.Goalkeeper
  );
  const navigate = useNavigate();
  const [previousActivePosition, setPreviousActivePosition] =
    useState(activePosition);
  const [search, setSearch] = useState('');
  const [customListFilter, setCustomListFilter] = useState<
    string | undefined
  >();
  const { up: isLaptop } = useScreenSize('laptop');
  const [benchOpen, setBenchOpen] = useState(false);
  const doCreateOrUpdateLineup = useCreateOrUpdateLineup({
    hideNotification: onboarding,
  });

  const initialLineup: EditableLineup<ContextProvider_vicc5Lineup_vicc5Appearances_card> =
    useMemo(() => getAppearancesByPosition(vicc5Appearances), [vicc5Appearances]);
  const [prevInitialLineup, setPrevInitialLineup] = useState(initialLineup);
  const [lineup, setLineup] = useState(initialLineup);
  if (initialLineup !== prevInitialLineup) {
    setPrevInitialLineup(initialLineup);
    setLineup(initialLineup);
  }

  const formation: FormationName = useMemo(() => {
    const defaultFormation: FormationName = 'default';

    const extraCard = lineup['Extra Player'].card;
    if (!extraCard) return defaultFormation;
    if (extraCard.position === 'Goalkeeper') return defaultFormation;

    return (
      formationFromExtraPlayerPosition[
        extraCard.position as CardPositionType
      ] || defaultFormation
    );
  }, [lineup]);

  const [statsView, toggleStatsView] = useLocalStorageToggle(
    'vicc5/ComposeTeam/ContextProvider',
    false
  );

  const [favoriteAverageScore, setFavoriteAverageScore] =
    useLocalStorage<AveragePlayerScore>(
      'vicc5/ComposeTeam/ContextProvider/defaultFavoriteAverageScore',
      AveragePlayerScore.LAST_FIFTEEN_VICC5_AVERAGE_SCORE
    );

  const [defaultAverageScore, setDefaultAverageScore] =
    useState<AveragePlayerScore | null>(vicc5Leaderboard.defaultAverageScore);

  const initialLineupCards = useMemo(
    () => vicc5Appearances.map(a => a.card.slug),
    [vicc5Appearances]
  );

  const lineupRarities = useMemo(
    () =>
      rarities.reduce((acc, rarity) => {
        acc[rarity as Scarcity] = Object.values(lineup).reduce(
          (sum, cur) => sum + (cur?.card?.rarity === rarity ? 1 : 0),
          0
        );
        return acc;
      }, {} as { [key in Scarcity]: number }),
    [lineup]
  );

  const isComplete = useCallback(
    (l = lineup) =>
      Object.values(l)
        .map((a: any) => a.card)
        .filter(Boolean).length === 5,
    [lineup]
  );

  const lineupComplete = useMemo(isComplete, [isComplete]);

  const sortedPositions = useMemo(
    () => getPositionSelectionOrder(formation),
    [formation]
  );

  const addCardToLineup = useCallback(
    (card: ContextProvider_vicc5Lineup_vicc5Appearances_card) => {
      const newAppearance = {
        ...emptyAppearance,
        card,
      };
      setLineup(existingLineup => {
        const newLineup = {
          ...existingLineup,
          [activePosition]: newAppearance,
        };
        if (!isComplete(newLineup)) {
          const nextIndex = sortedPositions.indexOf(activePosition) + 1;
          setActivePosition(sortedPositions[nextIndex % 5]);
        }

        return newLineup;
      });
    },
    [activePosition, isComplete, sortedPositions, setActivePosition]
  );

  const removeCardFromLineup = (position: Position) =>
    setLineup(existingLineup => ({
      ...existingLineup,
      [position]: emptyAppearance,
    }));

  const toggleCaptain = useCallback((captainPosition: Position) => {
    setLineup(existingLineup => {
      Object.entries(existingLineup!).forEach(([position, item]) => {
        if (position !== captainPosition) {
          item.captain = false;
        } else {
          item.captain = !item.captain;
        }
      });

      return { ...existingLineup };
    });
  }, []);

  const captain = useMemo(
    () => Object.values(lineup).find(i => i.captain) || null,
    [lineup]
  );

  const captainRarities: Scarcity[] = useMemo(() => {
    if (vicc5Leaderboard.rules?.captainRarities) {
      return vicc5Leaderboard.rules?.captainRarities as Scarcity[];
    }
    return [];
  }, [vicc5Leaderboard.rules]);

  const needCaptain = useMemo(
    () =>
      Object.values(lineup).some(
        item =>
          item.card && captainRarities.includes(item.card.rarity as Scarcity)
      ),
    [captainRarities, lineup]
  );

  const leaderboardRarities = !vicc5Leaderboard.rules?.rarityLimits
    ? rarities
    : rarities.filter(rarity => {
        if (toCamelCase(rarity) in vicc5Leaderboard.rules!.rarityLimits!) {
          return (
            vicc5Leaderboard.rules!.rarityLimits![
              toCamelCase(rarity) as Exclude<CamelCaseScarcity, 'customSeries'>
            ]?.max > 0
          );
        }
        return false;
      });
  const [cardsScarcities, setCardsScarcities] =
    useState<readonly Scarcity[]>(leaderboardRarities);

  const isCreateMode = vicc5Lineup === emptyLineup;

  const submit = async () => {
    setSubmitting(true);
    const result = await doCreateOrUpdateLineup({
      vicc5LeaderboardId: vicc5Leaderboard.id,
      name: vicc5Lineup.name,
      vicc5Appearances: Object.values(lineup).map(l => ({
        cardSlug: l.card!.slug,
        captain: l.captain,
      })),
      vicc5LineupId: vicc5Lineup.id.length === 0 ? null : vicc5Lineup.id,
    });
    setSubmitting(false);

    const mutationData = result.data?.createOrUpdateVicc5Lineup || {};
    if (
      !result.handledErrors &&
      !result.unhandledErrors &&
      !result.data?.createOrUpdateVicc5Lineup?.errors.length
    ) {
      if (isReorgApp && isCreateMode && 'vicc5Lineup' in mutationData) {
        navigate(
          generatePath(FOOTBALL_COMPOSE_TEAM_LINEUP, {
            vicc5LeaderboardSlug: vicc5Leaderboard.slug,
            vicc5LineupId: idFromObject((mutationData.vicc5Lineup as any)?.id),
          }),
          {
            state: {
              shouldShowSuccessDialog: true,
            },
            replace: true,
          }
        );
        return;
      }
      onSubmitSuccess(captain?.card?.pictureUrl || '');
    } else {
      const { handledErrors } = result;
      if (handledErrors?.length) {
        // setErrors(handledErrors); //TODO
      }
    }
  };

  const displayedAverageScore = isCappedMode
    ? AveragePlayerScore.LAST_FIFTEEN_VICC5_AVERAGE_SCORE
    : defaultAverageScore || favoriteAverageScore;

  const averageScoreOptions: { value: AveragePlayerScore; label: string }[] =
    useMemo(
      () => [
        { value: AveragePlayerScore.LAST_FIVE_VICC5_AVERAGE_SCORE, label: 'L5' },
        {
          value: AveragePlayerScore.LAST_FIFTEEN_VICC5_AVERAGE_SCORE,
          label: 'L15',
        },
      ],
      []
    );
  const toggleAvgScore = useCallback(() => {
    const newAverageScore = averageScoreOptions.find(
      ({ value }) => value !== displayedAverageScore
    );
    if (newAverageScore) {
      if (defaultAverageScore) {
        setDefaultAverageScore(newAverageScore.value);
      } else {
        setFavoriteAverageScore(newAverageScore.value);
      }
    }
  }, [
    averageScoreOptions,
    defaultAverageScore,
    displayedAverageScore,
    setFavoriteAverageScore,
  ]);

  const [showAffordableOnly, setShowAffordableOnly] = useShowAffordableOnly({
    lineup,
    setFilters,
    fifteenGameAverageTotalLimit,
  });

  if (activePosition !== previousActivePosition) {
    setIsDrawerOpen(false);
    setPreviousActivePosition(activePosition);
  }

  return (
    <Context.Provider
      value={{
        lineup,
        activePosition,
        setActivePosition,
        vicc5Lineup,
        vicc5Leaderboard,
        addCard: addCardToLineup,
        removeCard: removeCardFromLineup,
        initialLineupCards,
        toggleCaptain,
        onClose,
        lineupRarities,
        lineupComplete,
        submitting,
        submit,
        captain,
        needCaptain,
        captainRarities,
        sortedPositions,
        statsView,
        toggleStatsView,
        showFilters,
        filters,
        setFilters,
        search,
        setSearch,
        rules: vicc5Leaderboard.displayedRules,
        onboarding,
        isMobile: !isLaptop,
        favoriteAverageScore,
        setFavoriteAverageScore,
        benchOpen,
        setBenchOpen,
        defaultAverageScore,
        setDefaultAverageScore,
        displayedAverageScore,
        leaderboardRarities,
        cardsScarcities,
        setCardsScarcities,
        errors,
        isCappedMode,
        playerDetails,
        setPlayerDetails,
        isDrawerOpen,
        setIsDrawerOpen,
        showAffordableOnly,
        setShowAffordableOnly,
        averageScoreOptions,
        toggleAvgScore,
        customListFilter,
        setCustomListFilter,
        isCreateMode,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const cardFragment = gql`
  fragment ContextProvider_card on Card {
    slug
    assetId
    position: positionTyped
    rarity
    grade
    pictureUrl: pictureUrl(derivative: "tinified")
    avatarPictureUrl: pictureUrl(derivative: "avatar")
    lastFiveVicc5AverageScore: averageScore(type: LAST_FIVE_VICC5_AVERAGE_SCORE)
    lastFifteenVicc5AverageScore: averageScore(
      type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE
    )
    openedVicc5Lineups {
      id
      name
      vicc5Leaderboard {
        slug
        iconUrl
        rarityType
        displayName
        trainingCenter
        svgLogoUrl
        gameWeek
        vicc5League {
          slug
          name
          category
          restrictionGroup
        }
      }
    }
    season {
      startYear
    }
    singleCivilYear
    serialNumber
    power(vicc5LeaderboardSlug: $vicc5LeaderboardSlug)
    powerMalusAfterTransfer
    powerBreakdown(vicc5LeaderboardSlug: $vicc5LeaderboardSlug) {
      season
      xp
      scarcity
      collection
    }
    player {
      slug
      displayName
      vicc5Scores(last: 5) {
        id
        score
      }
      lastFiveVicc5Appearances
      lastFifteenVicc5Appearances
      activeClub {
        slug
      }
      gamesForLeaderboard(vicc5LeaderboardSlug: $vicc5LeaderboardSlug) {
        id
        status
        date
        homeTeam {
          ... on TeamInterface {
            slug
            name
            code
            ...TeamAvatar_team
          }
        }
        awayTeam {
          ... on TeamInterface {
            slug
            name
            code
            ...TeamAvatar_team
          }
        }
      }
      ...PlayerCurrentUnavailabilityBadge_player
    }
    token {
      slug
      assetId
      sentInLiveOffers {
        id
        type
      }
    }
    ...isMyCardListedOnMarket_card
    ...LineupCard_card
  }
  ${TeamAvatar.fragments.team}
  ${PlayerCurrentUnavailabilityBadge.fragments.player}
  ${LineupCard.fragments.card}
  ${isMyCardListedOnMarket.fragments.card}
` as TypedDocumentNode<ContextProvider_card>;

ContextProvider.fragments = {
  vicc5Leaderboard: gql`
    fragment ContextProvider_vicc5Leaderboard on Vicc5Leaderboard {
      id
      slug
      title
      displayName
      rarityType
      teamsCap
      iconUrl
      svgLogoUrl
      algoliaFilters
      trainingCenter
      gameWeek
      engineConfiguration {
        season
        grade
        captain
        scarcity
      }
      vicc5League {
        slug
        name
        category
        displayName
        shortDisplayName
        restrictionGroup
        vicc5Fixture {
          slug
        }
      }
      vicc5Fixture {
        slug
        startDate
        endDate
      }
      vicc5LeaderboardType
      defaultAverageScore
      rules {
        id
        captainRarities
        sumOfAverageScores
        rarityLimits {
          common {
            min
            max
          }
          limited {
            min
            max
          }
          rare {
            min
            max
          }
          superRare {
            min
            max
          }
          unique {
            min
            max
          }
        }
      }
      commonDraftCampaign {
        slug
        competitions {
          slug
          id
          ...ComposeOnboarding_competition
        }
      }
      ...Rules_vicc5Leaderboard
    }
    ${Rules.fragments.vicc5Leaderboard}
    ${ComposeOnboarding.fragments.competition}
  ` as TypedDocumentNode<ContextProvider_vicc5Leaderboard>,
  vicc5Lineup: gql`
    fragment ContextProvider_vicc5Lineup on Vicc5Lineup {
      id
      name
      vicc5Appearances {
        id
        captain
        card {
          slug
          assetId
          ...ContextProvider_card
        }
      }
      ...SocialShare_SocialPictures
    }
    ${SocialShare.fragments.socialPictures}
    ${cardFragment}
  ` as TypedDocumentNode<ContextProvider_vicc5Lineup>,
};

export default ContextProvider;
