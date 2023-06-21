import { gql } from '@apollo/client';
import { cloneElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import {
  FOOTBALL_DRAFT,
  FOOTBALL_LOBBY_UPCOMING_SWAP,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';
import { Link } from '@sorare/core/src/routing/Link';
import { theme } from '@sorare/core/src/style/theme';

import DropdownActions from '@football/components/lineup/DropdownActions';
import { useFootballEvents } from '@football/lib/events';
import getLineupActions from '@football/lib/lineup/getLineupActions';
import { LeaderboardAction } from '@football/types/leaderboard';

import ListItemAction from './ListItemAction';
import { CompetitionListActions_so5Leaderboard } from './__generated__/index.graphql';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  justify-content: flex-end;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding: 0 var(--intermediate-unit);
  }
`;

type Props = {
  so5Leaderboard: CompetitionListActions_so5Leaderboard;
  onActionSuccess: () => void;
  lineupId: number;
  linkToCompetitionDetails: string;
};

const CompetitionListActions = ({
  so5Leaderboard,
  onActionSuccess,
  lineupId,
  linkToCompetitionDetails,
}: Props) => {
  const track = useFootballEvents();
  const { mySo5Lineups } = so5Leaderboard;
  const lineup = mySo5Lineups[lineupId];
  const { availableActions, tooManyCards } = getLineupActions(
    lineup,
    so5Leaderboard
  );
  const draftUrl = generatePath(FOOTBALL_DRAFT, {
    slug: so5Leaderboard.slug,
  });

  const visibleActions = {
    [LeaderboardAction.Draft]: (
      <ListItemAction component={Link} to={draftUrl} fullWidth>
        <FormattedMessage
          {...(availableActions.includes(LeaderboardAction.ExtraDraft)
            ? fantasy.extraDraft
            : fantasy.draft)}
        />
      </ListItemAction>
    ),
    [LeaderboardAction.Redraft]: (
      <ListItemAction component={Link} to={draftUrl}>
        <FormattedMessage {...fantasy.redraft} />
      </ListItemAction>
    ),
    [LeaderboardAction.Swap]: (
      <ListItemAction
        component={Link}
        fullWidth
        to={generatePath(FOOTBALL_LOBBY_UPCOMING_SWAP, {
          leaderboardSlug: so5Leaderboard.slug,
        })}
      >
        <FormattedMessage {...fantasy.swap} />
      </ListItemAction>
    ),
    [LeaderboardAction.Edit]: (
      <ListItemAction
        color="white"
        component={Link}
        fullWidth
        to={getComposeTeamRoute({
          so5LeaderboardSlug: so5Leaderboard.slug,
          so5LineupId: idFromObject(lineup?.id),
        })}
      >
        <FormattedMessage {...glossary.edit} />
      </ListItemAction>
    ),
    [LeaderboardAction.Compose]: (
      <ListItemAction
        color="blue"
        component={Link}
        fullWidth
        to={getComposeTeamRoute({
          so5LeaderboardSlug: so5Leaderboard.slug,
        })}
      >
        <FormattedMessage {...glossary.register} />
      </ListItemAction>
    ),
    [LeaderboardAction.Unlock]: (
      <ListItemAction
        component={Link}
        fullWidth
        to={linkToCompetitionDetails}
        onClick={() => {
          track('Click Competition', {
            leaderboardSlug: so5Leaderboard.slug,
            leaderboardName: so5Leaderboard.displayName,
          });
        }}
      >
        <FormattedMessage id="LineupActions.Unlock" defaultMessage="Unlock" />
      </ListItemAction>
    ),
  };

  const getContent = () => {
    if (tooManyCards) {
      return (
        <ListItemAction fullWidth disabled>
          <Tooltip title={so5Leaderboard.canCompose.reason || ''}>
            <FormattedMessage
              id="CompetitionListActions.locked"
              defaultMessage="Locked"
            />
          </Tooltip>
        </ListItemAction>
      );
    }
    return (
      <>
        {Object.entries(visibleActions)
          .filter(([key]) =>
            availableActions.includes(key as LeaderboardAction)
          )
          .map(([key, element]) => cloneElement(element, { key }))}

        <DropdownActions
          so5Leaderboard={so5Leaderboard}
          so5Lineup={lineup}
          onActionSuccess={onActionSuccess}
        />
      </>
    );
  };
  return <Wrapper>{getContent()}</Wrapper>;
};

CompetitionListActions.fragments = {
  so5Leaderboard: gql`
    fragment CompetitionListActions_so5Leaderboard on So5Leaderboard {
      slug
      displayName
      mySo5Lineups {
        id
        ...DropdownActions_so5Lineup
        ...getLineupActions_so5Lineup
      }
      canCompose {
        reason
      }
      ...getLineupActions_so5Leaderboard
      ...DropdownActions_so5Leaderboard
    }
    ${getLineupActions.fragments.so5Leaderboard}
    ${getLineupActions.fragments.so5Lineup}
    ${DropdownActions.fragments.so5Lineup}
    ${DropdownActions.fragments.so5Leaderboard}
  `,
};
export default CompetitionListActions;
