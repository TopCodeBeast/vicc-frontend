import { gql } from '@apollo/client';
import styled from 'styled-components';

import { LinkBox } from '@sorare/core/src/atoms/navigation/Box';
import FollowButton from '@sorare/core/src/components/user/FollowButton';
import { range } from '@sorare/core/src/lib/arrays';

import { FlexCard } from '@football/components/card/FlexCard';
import Info from '@football/components/user/Info';

import { UserNetworkBlock_user } from './__generated__/index.graphql';

type Props = {
  user: UserNetworkBlock_user & { subscriptionSlug?: string };
};

const Wrapper = styled(LinkBox)`
  background: var(--c-neutral-200);
  border-radius: var(--double-unit);
  color: var(--c-neutral-1000);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  isolation: isolate;
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
  }
  &:focus-visible {
    outline: 3px solid var(--c-neutral-300);
  }
`;

const Header = styled.header`
  display: flex;
  gap: var(--double-unit);
  justify-content: space-between;
  text-transform: capitalize;
  padding: var(--double-unit) 0;
  margin: 0 var(--double-unit);
  border-bottom: 1px solid rgba(var(--c-rgb-neutral-100), 0.25);
`;

const Cards = styled.div`
  gap: var(--unit);
  padding: var(--unit) var(--intermediate-unit);
  justify-content: space-between;
  display: flex;
  z-index: 1;
  > * {
    flex: 1;
  }
`;

const EmptyCard = styled.div`
  background-color: var(--c-neutral-300);
  border-radius: var(--unit);
  aspect-ratio: var(--card-aspect-ratio);
`;

export const UserNetworkBlock = ({ user }: Props) => {
  const { slug, highlightedDeck } = user;

  return (
    <Wrapper>
      <Header>
        <Info user={user} />
        <FollowButton
          small
          subscribable={{ slug, __typename: 'User' }}
          initialSubscription={user.followed}
        />
      </Header>
      <Cards>
        {highlightedDeck?.deckCards.nodes.map(dc => (
          <FlexCard key={dc.id} card={dc.card} width={160} withLink />
        ))}
        {range(5 - (highlightedDeck?.deckCards.nodes.length || 0)).map(
          (_, index) => (
            <EmptyCard
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            />
          )
        )}
      </Cards>
    </Wrapper>
  );
};

UserNetworkBlock.fragments = {
  user: gql`
    fragment UserNetworkBlock_user on PublicUserInfoInterface {
      slug
      followed {
        slug
      }
      ...Info_user
      highlightedDeck {
        slug
        deckCards(first: 5) {
          nodes {
            id
            cardIndex
            card {
              slug
              assetId
              ...FlexCard_card
            }
          }
        }
      }
    }
    ${Info.fragments.user}
    ${FlexCard.fragments.card}
  `,
};

export default UserNetworkBlock;
