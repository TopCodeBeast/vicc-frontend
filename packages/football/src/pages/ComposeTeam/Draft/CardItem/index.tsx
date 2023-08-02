import { TypedDocumentNode, gql } from '@apollo/client';
import { faCircleInfo, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import {
  LinkBox,
  LinkOther,
  LinkOverlay,
} from '@sorare/core/src/atoms/navigation/Box';
import { Text16, button12 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';

import GameCompactInfo from '@football/components/composeTeam/GameCompactInfo';
import PlayerCurrentUnavailabilityBadge from '@football/components/player/PlayerCurrentUnavailabilityBadge';
import { positionShortNames } from '@football/lib/so5';

import { ComposeTeamDraft_CardItem_draftablePlayer } from './__generated__/index.graphql';

const Root = styled(LinkBox)`
  display: flex;
  gap: var(--intermediate-unit);
  align-items: center;
  padding: var(--intermediate-unit);
  width: 100%;
  box-shadow: var(--shadow-100);
  border-radius: var(--double-unit);
  text-align: left;
  background: var(--c-neutral-300);
  color: var(--c-neutral-1000);
  cursor: pointer;
  img {
    max-width: 100%;
  }
  &.selected {
    outline: 1px solid var(--c-neutral-600);
  }
  &:hover,
  &:focus {
    &:not(.selected) {
      box-shadow: var(--shadow-200);
    }
  }
`;
const StyledCardImg = styled(CardImg)`
  width: 60px;
  box-shadow: var(--shadow-100);
  border-radius: inherit;
`;
const Avatar = styled.div`
  position: relative;
  isolation: isolate;
  border-radius: var(--unit);
  min-width: 60px;
`;
const PositionWrapper = styled.div`
  ${button12}
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: var(--c-static-neutral-100);
  text-align: center;
  backdrop-filter: blur(10px);
  background: transparent;
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
`;
const Info = styled.div`
  display: grid;
  grid-template-areas:
    'name remove'
    'details remove';
  column-gap: var(--double-unit);
  align-items: center;
  grid-template-columns: 1fr max-content;
  width: 100%;
  button {
    text-align: left;
  }
`;
const Name = styled(Text16)`
  grid-area: name;
`;
const Details = styled.div`
  grid-area: details;
  display: flex;
  gap: var(--double-unit);
`;

const FlexColContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Remove = styled(LinkOther).attrs({ as: 'button' })`
  grid-area: remove;
  padding: var(--unit);
`;
const PlayerDetailsButton = styled(LinkOther).attrs({
  as: IconButton,
})`
  width: 40px;
  height: 40px;
`;

type Props = {
  onClick: () => void;
  selected: boolean;
  onRemove: (id: string) => void;
  drafted: ComposeTeamDraft_CardItem_draftablePlayer;
  togglePlayerDetails: () => void;
};

const CardItem = ({
  onClick,
  selected,
  onRemove,
  drafted,
  togglePlayerDetails,
}: Props) => {
  const { nextGame: upcomingGame } = drafted;
  const { formatMessage } = useIntl();

  return (
    <Root key={drafted.id} className={classnames({ selected })}>
      <Avatar>
        <StyledCardImg src={drafted.avatarUrl} alt="" width={80} height={80} />
        {positionShortNames[drafted.position] && (
          <PositionWrapper>
            <FormattedMessage {...positionShortNames[drafted.position]} />
          </PositionWrapper>
        )}
      </Avatar>
      <Info>
        <LinkOverlay onClick={onClick} as="button">
          <Name>
            <strong>{drafted.player.displayName}</strong>
          </Name>
          <Details>
            <GameCompactInfo games={upcomingGame ? [upcomingGame] : []} />
            <PlayerCurrentUnavailabilityBadge player={drafted.player} />
          </Details>
        </LinkOverlay>

        <FlexColContainer>
          {selected && (
            <Remove
              onClick={() => {
                onRemove(drafted.id);
              }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                title={formatMessage({
                  id: 'ComposeTeamDraft.CardItem.Remove',
                  defaultMessage: 'Remove from lineup',
                })}
              />
            </Remove>
          )}
          <PlayerDetailsButton onClick={togglePlayerDetails}>
            <Text16>
              <FontAwesomeIcon icon={faCircleInfo} color="white" />
            </Text16>
          </PlayerDetailsButton>
        </FlexColContainer>
      </Info>
    </Root>
  );
};

CardItem.fragments = {
  draftablePlayer: gql`
    fragment ComposeTeamDraft_CardItem_draftablePlayer on DraftablePlayer {
      id
      avatarUrl
      position
      player {
        slug
        displayName
        ...PlayerCurrentUnavailabilityBadge_player
      }
      nextGame {
        id
        ...GameCompactInfo_game
      }
    }
    ${PlayerCurrentUnavailabilityBadge.fragments.player}
    ${GameCompactInfo.fragments.game}
  ` as TypedDocumentNode<ComposeTeamDraft_CardItem_draftablePlayer>,
};

export default CardItem;
