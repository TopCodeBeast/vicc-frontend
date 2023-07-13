import { gql } from '@apollo/client';
import { faUnlockAlt } from '@fortawesome/pro-regular-svg-icons';
import { faRandom, faRotate } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import {
  FOOTBALL_DRAFT,
  FOOTBALL_LOBBY_UPCOMING_SWAP,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
// import { getInteractionContext } from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';
import { Link } from '@sorare/core/src/routing/Link';

// import LineupActionButton from '@football/components/lineup/LineupActionButton';
import { useFootballEvents } from '@football/lib/events';
// import getLineupActions from '@football/lib/lineup/getLineupActions';
// import { LeaderboardAction } from '@football/types/leaderboard';

import { LineupActions_so5Leaderboard } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--half-unit);
  justify-content: space-between;
  padding: var(--unit) var(--intermediate-unit);

  & ${LineupActionButton} {
    min-width: calc(50% - var(--half-unit));
    flex-grow: 1;
  }
`;

export type Props = {
  so5Leaderboard: LineupActions_so5Leaderboard;
  linkToCompetitionDetails: string;
  lineupId?: string;
  renderCta?: () => JSX.Element;
};

const LineupActions = ({
  so5Leaderboard,
  linkToCompetitionDetails,
  lineupId,
  renderCta,
}: Props) => {
  // const track = useEvents();
  // const footballTrack = useFootballEvents();

  // if (renderCta) {
  //   return <Root>{renderCta()}</Root>;
  // }

  // const lineup =
  //   so5Leaderboard.mySo5Lineups.find(({ id }) => id === lineupId) ||
  //   so5Leaderboard.mySo5Lineups[0];

  // const { availableActions } = getLineupActions(lineup, so5Leaderboard);

  // const draftUrl = generatePath(FOOTBALL_DRAFT, {
  //   slug: so5Leaderboard.slug,
  // });

  // const actions = {
  //   [LeaderboardAction.Draft]: (
  //     <LineupActionButton as={Link} to={draftUrl}>
  //       <FormattedMessage
  //         {...(availableActions.includes(LeaderboardAction.ExtraDraft)
  //           ? fantasy.extraDraft
  //           : fantasy.draft)}
  //       />
  //     </LineupActionButton>
  //   ),
  //   [LeaderboardAction.Redraft]: (
  //     <LineupActionButton as={Link} to={draftUrl}>
  //       <FontAwesomeIcon icon={faRandom} />
  //       <FormattedMessage {...fantasy.redraft} />
  //     </LineupActionButton>
  //   ),
  //   [LeaderboardAction.Swap]: (
  //     <LineupActionButton
  //       as={Link}
  //       to={generatePath(FOOTBALL_LOBBY_UPCOMING_SWAP, {
  //         leaderboardSlug: so5Leaderboard.slug,
  //       })}
  //       onClick={() => {
  //         track('Click Swap', {
  //           context: getInteractionContext(),
  //         });
  //       }}
  //     >
  //       <FontAwesomeIcon icon={faRotate} />
  //       <FormattedMessage {...fantasy.swap} />
  //     </LineupActionButton>
  //   ),
  //   [LeaderboardAction.Edit]: (
  //     <LineupActionButton
  //       as={Link}
  //       to={getComposeTeamRoute({
  //         so5LeaderboardSlug: so5Leaderboard.slug,
  //         so5LineupId: idFromObject(lineup?.id),
  //       })}
  //       onClick={() => {
  //         track('Click Edit Lineup', {
  //           context: getInteractionContext(),
  //         });
  //       }}
  //     >
  //       <FormattedMessage {...glossary.edit} />
  //     </LineupActionButton>
  //   ),
  //   [LeaderboardAction.Compose]: (
  //     <LineupActionButton
  //       className="primary"
  //       as={Link}
  //       to={getComposeTeamRoute({
  //         so5LeaderboardSlug: so5Leaderboard.slug,
  //       })}
  //       onClick={() => {
  //         track('Click Compose Lineup', {
  //           context: getInteractionContext(),
  //         });
  //       }}
  //     >
  //       <FormattedMessage {...glossary.register} />
  //     </LineupActionButton>
  //   ),
  //   [LeaderboardAction.Unlock]: (
  //     <LineupActionButton
  //       as={Link}
  //       to={linkToCompetitionDetails}
  //       onClick={() => {
  //         footballTrack('Click Competition', {
  //           leaderboardSlug: so5Leaderboard.slug,
  //           leaderboardName: so5Leaderboard.displayName,
  //         });
  //       }}
  //     >
  //       <FontAwesomeIcon icon={faUnlockAlt} />
  //       <FormattedMessage id="LineupActions.Unlock" defaultMessage="Unlock" />
  //     </LineupActionButton>
  //   ),
  // };

  // const actionToDisplay = Object.entries(actions).filter(([key]) =>
  //   availableActions.includes(key as LeaderboardAction)
  // );

  // if (actionToDisplay.length === 0) {
  //   return null;
  // }

  // return (
  //   <Root>
  //     {actionToDisplay.map(([key, element]) => cloneElement(element, { key }))}
  //   </Root>
  // );
  return (<>LineupActions13</>)
};

LineupActions.fragments = {
  so5Leaderboard: gql`
    fragment LineupActions_so5Leaderboard on Vicc5Leaderboard {
      slug
      displayName
      mySo5Lineups: myVicc5Lineups {
        id
        #...getLineupActions_so5Lineup
      }
      #...getLineupActions_so5Leaderboard
    }
    #{getLineupActions.fragments.so5Lineup}
    #{getLineupActions.fragments.so5Leaderboard}
  `,
};

export default LineupActions;
