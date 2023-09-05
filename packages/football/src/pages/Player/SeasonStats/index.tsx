import { TypedDocumentNode, gql } from '@apollo/client';
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faBullseyeArrow,
  faDoorOpen,
  faHandsHelping,
  faHourglassStart,
  faRectanglePortrait,
} from '@fortawesome/pro-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { attributes } from '@sorare/core/src/lib/players';

import InfoLineWithLogoAndValue from '@football/pages/Player/InfoLineWithLogoAndValue';

import {
  SeasonStatsQuery,
  SeasonStatsQueryVariables,
} from './__generated__/index.graphql';

type Props = {
  playerSlug: string;
  seasonStartYear: number;
};

export const SEASON_STATS_QUERY = gql`
  query SeasonStatsQuery($playerSlug: String!, $seasonStartYear: Int!) {
    #football {
      player(slug: $playerSlug) {
        slug
        stats(seasonStartYear: $seasonStartYear) {
          assists
          appearances
          goals
          yellowCards
          redCards
          minutesPlayed
          substituteIn
          substituteOut
        }
      }
    #}
  }
` as TypedDocumentNode<SeasonStatsQuery, SeasonStatsQueryVariables>;

const emptyValues = {
  appearances: '-',
  assists: '-',
  goals: '-',
  minutesPlayed: '-',
  redCards: '-',
  substituteIn: '-',
  substituteOut: '-',
  yellowCards: '-',
};

const Root = styled(Block)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SeasonStats = ({ playerSlug, seasonStartYear }: Props) => {
  const { data } = useQuery(SEASON_STATS_QUERY, {
    variables: {
      playerSlug,
      seasonStartYear,
    },
  });

  const {
    appearances,
    assists,
    goals,
    minutesPlayed,
    redCards,
    substituteIn,
    substituteOut,
    yellowCards,
  } = data?.player.stats || emptyValues;

  const renderIcon = (icon: FontAwesomeIconProps['icon']) => (
    <FontAwesomeIcon icon={icon} />
  );
  return (
    <Root>
      <InfoLineWithLogoAndValue
        iconColor="green"
        message={attributes.appearances}
        value={appearances}
        icon={renderIcon(faDoorOpen)}
      />
      <InfoLineWithLogoAndValue
        iconColor="green"
        message={attributes.minPlayed}
        value={minutesPlayed}
        icon={renderIcon(faHourglassStart)}
      />
      <InfoLineWithLogoAndValue
        iconColor="green"
        message={attributes.assists}
        value={assists}
        icon={renderIcon(faHandsHelping)}
      />
      <InfoLineWithLogoAndValue
        iconColor="green"
        message={attributes.goals}
        value={goals}
        icon={renderIcon(faBullseyeArrow)}
      />
      <InfoLineWithLogoAndValue
        iconColor="green"
        message={attributes.substituteIn}
        value={substituteIn}
        icon={renderIcon(faArrowCircleUp)}
      />
      <InfoLineWithLogoAndValue
        iconColor="yellow"
        message={attributes.yellowCards}
        value={yellowCards}
        icon={renderIcon(faRectanglePortrait)}
      />
      <InfoLineWithLogoAndValue
        iconColor="red"
        message={attributes.substituteOut}
        value={substituteOut}
        icon={renderIcon(faArrowCircleDown)}
      />
      <InfoLineWithLogoAndValue
        iconColor="red"
        message={attributes.redCards}
        value={redCards}
        icon={renderIcon(faRectanglePortrait)}
      />
    </Root>
  );
};

export default SeasonStats;
