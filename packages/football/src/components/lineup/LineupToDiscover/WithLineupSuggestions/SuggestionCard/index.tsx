import { TypedDocumentNode, gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { AnimatedCardSwap } from '@sorare/core/src/atoms/animations/AnimatedCardSwap';
import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { proxyUrl } from '@sorare/core/src/atoms/ui/ResponsiveImg';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { FOOTBALL_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { Link } from '@sorare/core/src/routing/Link';

import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import { SuggestionCard_card } from './__generated__/index.graphql';

const ImgWrapper = styled.div`
  transition: transform 200ms ease-in-out;
`;

const Wrapper = styled(LinkOther)`
  display: flex;
  align-items: flex-start;
  &:hover,
  &:focus {
    & ${ImgWrapper} {
      transform: scale(1.05);
    }
  }
`;
const IconWrapper = styled.div`
  position: absolute;
  top: calc(-1 * var(--unit));
  right: calc(-1 * var(--unit));
  width: var(--triple-unit);
  height: var(--triple-unit);
  background: var(--c-brand-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font: var(--t-bold) var(--t-16);
`;

type Props = {
  card: SuggestionCard_card;
};

const SuggestionCard = ({ card }: Props) => {
  const { fiatCurrency } = useCurrentUserContext();
  const { trackClickCard } = useMarketplaceContext();

  return (
    <Wrapper
      as={Link}
      to={generatePath(FOOTBALL_CARD_SHOW, {
        slug: card.slug,
      })}
      onClick={() => {
        if (card.assetId) {
          trackClickCard(card.assetId, Sport.CRICKET);
        }
      }}
    >
      <ImgWrapper>
        <AnimatedCardSwap
          imgUrl={
            card.pictureUrl
              ? proxyUrl(card.pictureUrl, {
                  cropWidth: 80,
                })
              : `${FRONTEND_ASSET_HOST}/cards/back/limited.svg`
          }
        />
        <IconWrapper>{fiatCurrency.symbol}</IconWrapper>
      </ImgWrapper>
    </Wrapper>
  );
};

SuggestionCard.fragments = {
  card: gql`
    fragment SuggestionCard_card on Card {
      slug
      assetId
      pictureUrl
    }
  ` as TypedDocumentNode<SuggestionCard_card>,
};

export default SuggestionCard;
