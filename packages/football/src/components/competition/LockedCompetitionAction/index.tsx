import { TypedDocumentNode, gql } from '@apollo/client';
import { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { MissingCardsMessage } from '@football/components/unlockCompetition/MissingCardsMessage';
import { getDraftUrl } from '@football/components/unlockCompetition/getDraftUrl';
import { getMarketUrl } from '@football/components/unlockCompetition/getMarketUrl';
import { getMissingCards } from '@football/components/unlockCompetition/getMissingCards';

import { LockedCompetitionAction_vicc5Leaderboard } from './__generated__/index.graphql';

const Content = styled.div`
  padding: var(--double-unit);
  border-radius: var(--intermediate-unit);
  display: flex;
  gap: var(--unit);
  flex-direction: column;
  position: relative;
  box-shadow: 0px 3px 2px #14161b;
  @media ${tabletAndAbove} {
    flex-direction: row;
    align-items: center;
    & > *:first-child {
      flex: 1;
    }
  }
  & > * {
    z-index: 1;
  }
  background: linear-gradient(
      rgba(var(--c-static-rgb-yellow-300), 0.2),
      rgba(var(--c-static-rgb-yellow-300), 0.2)
    ),
    var(--c-neutral-300);
`;

type Props = {
  vicc5Leaderboard: Nullable<LockedCompetitionAction_vicc5Leaderboard>;
  Wrapper: FunctionComponent<React.PropsWithChildren<unknown>>;
};

export const LockedCompetitionAction = ({ vicc5Leaderboard, Wrapper }: Props) => {
  if (!vicc5Leaderboard?.canCompose?.notEnoughEligibleCards) {
    return null;
  }

  const marketUrl = getMarketUrl(vicc5Leaderboard);
  const { common } = getMissingCards(vicc5Leaderboard.canCompose);
  const shouldDraft = common > 0;

  return (
    <Wrapper>
      <Content>
        <Text16 bold color="var(--c-yellow-800)">
          <MissingCardsMessage validity={vicc5Leaderboard.canCompose} />
        </Text16>
        {shouldDraft ? (
          <Button
            small
            color="black"
            component={Link}
            to={getDraftUrl(vicc5Leaderboard)}
          >
            <FormattedMessage {...fantasy.draft} />
          </Button>
        ) : (
          <Button small color="black" component={Link} to={marketUrl}>
            <FormattedMessage
              id="LockedCompetitionAction.cta"
              defaultMessage="View cards to buy"
            />
          </Button>
        )}
      </Content>
    </Wrapper>
  );
};

LockedCompetitionAction.fragments = {
  vicc5Leaderboard: gql`
    fragment LockedCompetitionAction_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      canCompose {
        notEnoughEligibleCards
        ...MissingCardsMessage_validity
        ...getMissingCards_validity
      }
      ...getMarketUrl_vicc5Leaderboard
      ...getDraftUrl_vicc5Leaderboard
    }
    ${MissingCardsMessage.fragments.validity}
    ${getMarketUrl.fragments.vicc5Leaderboard}
    ${getDraftUrl.fragments.vicc5Leaderboard}
    ${getMissingCards.fragments.validity}
  ` as TypedDocumentNode<LockedCompetitionAction_vicc5Leaderboard>,
};
