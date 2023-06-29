import { gql } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';

import {
  AveragePlayerScore,
  Position as GlobalPosition,
} from '@sorare/core/src/__generated__/globalTypes';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';
import useLocalStorageToggle from '@sorare/core/src/hooks/useLocalStorageToggle';
import {
  CamelCaseScarcity,
  Scarcity,
  isListedOnMarket,
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
  formationFromExtraPlayerPosition,
  getAppearancesByPosition,
  getPositionSelectionOrder,
} from '@football/lib/so5';

import {
  ContextProvider_card,
  ContextProvider_so5Leaderboard,
  ContextProvider_so5Lineup,
} from './__generated__/index.graphql';
import useShowAffordableOnly from './useShowAffordableOnly';

type ContextProvider_so5Lineup_so5Appearances =
  ContextProvider_so5Lineup['so5Appearances'][number];

type ContextProvider_so5Lineup_so5Appearances_card =
  ContextProvider_so5Lineup_so5Appearances['card'];

export interface So5ComposeLineupProps {
  onClose: () => void;
  onSubmitSuccess: (captainPictureUrl?: string) => void;
  so5Leaderboard: ContextProvider_so5Leaderboard;
  so5Lineup: ContextProvider_so5Lineup;
  onboarding?: boolean;
  children?: React.ReactNode;
}

const ContextProvider = ({
  onClose,
  onSubmitSuccess,
  so5Leaderboard,
  so5Lineup,
  onboarding = false,
  children,
}: So5ComposeLineupProps) => {
  const { so5Appearances } = so5Lineup;

  const showFilters = !onboarding;
  const fifteenGameAverageTotalLimit = so5Leaderboard.rules?.sumOfAverageScores;
  const isCappedMode = !!fifteenGameAverageTotalLimit;

  const initialFilters: BenchFilters = {
    includeNoGameCards: !showFilters,
    includeUsedCards: !showFilters,
    ...(isCappedMode
      ? {
          lastFifteenSo5AverageScore: {
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
  const [search, setSearch] = useState('');
  const [customListFilter, setCustomListFilter] = useState<
    string | undefined
  >();
  const { up: isLaptop } = useScreenSize('laptop');
  const [benchOpen, setBenchOpen] = useState(false);
  const doCreateOrUpdateLineup = useCreateOrUpdateLineup({
    hideNotification: onboarding,
  });

  const initialLineup: EditableLineup<ContextProvider_so5Lineup_so5Appearances_card> =
    useMemo(() => getAppearancesByPosition(so5Appearances), [so5Appearances]);
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
    'so5/ComposeTeam/ContextProvider',
    false
  );

  const [favoriteAverageScore, setFavoriteAverageScore] =
    useLocalStorage<AveragePlayerScore>(
      'so5/ComposeTeam/ContextProvider/defaultFavoriteAverageScore',
      AveragePlayerScore.LAST_FIFTEEN_SO5_AVERAGE_SCORE
    );

  const [defaultAverageScore, setDefaultAverageScore] =
    useState<AveragePlayerScore | null>(so5Leaderboard.defaultAverageScore);

  const initialLineupCards = useMemo(
    () => so5Appearances.map(a => a.card.slug),
    [so5Appearances]
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
      Object.values<ContextProvider_so5Lineup_so5Appearances>(l!)
        .map(a => a.card)
        .filter(Boolean).length === 5,
    [lineup]
  );

  const lineupComplete = useMemo(isComplete, [isComplete]);

  const sortedPositions = useMemo(
    () => getPositionSelectionOrder(formation),
    [formation]
  );

  const addCardToLineup = useCallback(
    (card: ContextProvider_so5Lineup_so5Appearances_card) => {
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
    if (so5Leaderboard.rules?.captainRarities) {
      return so5Leaderboard.rules?.captainRarities as Scarcity[];
    }
    return [];
  }, [so5Leaderboard.rules]);

  const needCaptain = useMemo(
    () =>
      Object.values(lineup).some(
        item =>
          item.card && captainRarities.includes(item.card.rarity as Scarcity)
      ),
    [captainRarities, lineup]
  );

  const leaderboardRarities = !so5Leaderboard.rules?.rarityLimits
    ? rarities
    : rarities.filter(rarity => {
        if (toCamelCase(rarity) in so5Leaderboard.rules!.rarityLimits!) {
          return (
            so5Leaderboard.rules!.rarityLimits![
              toCamelCase(rarity) as Exclude<CamelCaseScarcity, 'customSeries'>
            ]?.max > 0
          );
        }
        return false;
      });
  const [cardsScarcities, setCardsScarcities] =
    useState<readonly Scarcity[]>(leaderboardRarities);

  const submit = async () => {
    setSubmitting(true);
    const lineupErrors = await doCreateOrUpdateLineup({
      so5LeaderboardId: so5Leaderboard.id,
      name: so5Lineup.name,
      so5Appearances: Object.values(lineup).map(l => ({
        cardSlug: l.card!.slug,
        captain: l.captain,
      })),
      so5LineupId: so5Lineup.id.length === 0 ? null : so5Lineup.id,
    });
    setSubmitting(false);
    if (!lineupErrors) {
      onSubmitSuccess(captain?.card?.pictureUrl || '');
    } else {
      const { handledErrors } = lineupErrors;
      if (handledErrors.length) {
        setErrors(handledErrors);
      }
    }
  };

  const displayedAverageScore = isCappedMode
    ? AveragePlayerScore.LAST_FIFTEEN_SO5_AVERAGE_SCORE
    : defaultAverageScore || favoriteAverageScore;

  const averageScoreOptions: { value: AveragePlayerScore; label: string }[] =
    useMemo(
      () => [
        { value: AveragePlayerScore.LAST_FIVE_SO5_AVERAGE_SCORE, label: 'L5' },
        {
          value: AveragePlayerScore.LAST_FIFTEEN_SO5_AVERAGE_SCORE,
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

  return (
    <Context.Provider
      value={{
        lineup,
        activePosition,
        setActivePosition,
        so5Lineup,
        so5Leaderboard,
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
        rules: so5Leaderboard.displayedRules,
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
    lastFiveSo5AverageScore: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE)
    lastFifteenSo5AverageScore: averageScore(
      type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
    )
    openedSo5Lineups {
      id
      name
      so5Leaderboard {
        slug
        iconUrl
        rarityType
        displayName
        trainingCenter
        svgLogoUrl
        gameWeek
        so5League {
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
    power(so5LeaderboardSlug: $so5LeaderboardSlug)
    powerMalusAfterTransfer
    powerBreakdown(so5LeaderboardSlug: $so5LeaderboardSlug) {
      season
      xp
      scarcity
      collection
    }
    player {
      slug
      displayName
      so5Scores(last: 5) {
        id
        score
      }
      lastFiveSo5Appearances
      lastFifteenSo5Appearances
      activeClub {
        slug
      }
      gamesForLeaderboard(so5LeaderboardSlug: $so5LeaderboardSlug) {
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
    ...isListedOnMarket_card
    ...LineupCard_card
  }
  ${TeamAvatar.fragments.team}
  ${PlayerCurrentUnavailabilityBadge.fragments.player}
  ${LineupCard.fragments.card}
  ${isListedOnMarket.fragments.card}
`;

ContextProvider.fragments = {
  so5Leaderboard: gql`
    fragment ContextProvider_so5Leaderboard on So5Leaderboard {
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
      so5League {
        slug
        name
        category
        displayName
        shortDisplayName
        restrictionGroup
        so5Fixture {
          slug
        }
      }
      so5Fixture {
        slug
        startDate
        endDate
      }
      so5LeaderboardType
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
      ...Rules_so5Leaderboard
    }
    ${Rules.fragments.so5Leaderboard}
    ${ComposeOnboarding.fragments.competition}
  `,
  so5Lineup: gql`
    fragment ContextProvider_so5Lineup on So5Lineup {
      id
      name
      so5Appearances {
        id
        captain
        card {
          slug
          assetId
          ...ContextProvider_card
        }
      }
    }
    ${cardFragment}
  `,
};

export default ContextProvider;
