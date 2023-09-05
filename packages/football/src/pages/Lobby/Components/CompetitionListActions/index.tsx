import { TypedDocumentNode, gql } from '@apollo/client';
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
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import DropdownActions from '@football/components/lineup/DropdownActions';
import { useFootballEvents } from '@football/lib/events';
import getLineupActions from '@football/lib/lineup/getLineupActions';
import { LeaderboardAction } from '@football/types/leaderboard';

import ListItemAction from './ListItemAction';
import { CompetitionListActions_vicc5Leaderboard } from './__generated__/index.graphql';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  justify-content: flex-end;
  @media ${laptopAndAbove} {
    padding: 0 var(--intermediate-unit);
  }
`;

type Props = {
  vicc5Leaderboard: CompetitionListActions_vicc5Leaderboard;
  onActionSuccess: () => void;
  lineupId: number;
  linkToCompetitionDetails: string;
};

const CompetitionListActions = ({
  vicc5Leaderboard,
  onActionSuccess,
  lineupId,
  linkToCompetitionDetails,
}: Props) => {
  const track = useFootballEvents();
  const { myVicc5Lineups } = vicc5Leaderboard;
  const lineup = myVicc5Lineups[lineupId];
  const { availableActions, tooManyCards } = getLineupActions(
    lineup,
    vicc5Leaderboard
  );
  const draftUrl = generatePath(FOOTBALL_DRAFT, {
    slug: vicc5Leaderboard.slug,
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
          leaderboardSlug: vicc5Leaderboard.slug,
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
          vicc5LeaderboardSlug: vicc5Leaderboard.slug,
          vicc5LineupId: idFromObject(lineup?.id),
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
          vicc5LeaderboardSlug: vicc5Leaderboard.slug,
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
            leaderboardSlug: vicc5Leaderboard.slug,
            leaderboardName: vicc5Leaderboard.displayName,
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
          <Tooltip title={vicc5Leaderboard.canCompose.reason || ''}>
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
          vicc5Leaderboard={vicc5Leaderboard}
          vicc5Lineup={lineup}
          onActionSuccess={onActionSuccess}
        />
      </>
    );
  };
  return <Wrapper>{getContent()}</Wrapper>;
};

CompetitionListActions.fragments = {
  vicc5Leaderboard: gql`
    fragment CompetitionListActions_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      displayName
      myVicc5Lineups {
        id
        ...DropdownActions_vicc5Lineup
        ...getLineupActions_vicc5Lineup
      }
      canCompose {
        reason
      }
      ...getLineupActions_vicc5Leaderboard
      ...DropdownActions_vicc5Leaderboard
    }
    ${getLineupActions.fragments.vicc5Leaderboard}
    ${getLineupActions.fragments.vicc5Lineup}
    ${DropdownActions.fragments.vicc5Lineup}
    ${DropdownActions.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<CompetitionListActions_vicc5Leaderboard>,
};
export default CompetitionListActions;
