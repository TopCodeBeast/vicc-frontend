import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { FOOTBALL_PLAYER_SHOW_CARDS } from '@sorare/core/src/constants/routes';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { glossary } from '@sorare/core/src/lib/glossary';
import { Link } from '@sorare/core/src/routing/Link';

import {
  EmptySlot_cardCollectionSlot,
  EmptySlot_token,
} from './__generated__/index.graphql';

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;

  &:hover,
  &:focus {
    color: inherit;
  }
`;
const Wrapper = styled.div`
  aspect-ratio: var(--card-aspect-ratio);
  width: 100%;
  border: 1px dashed var(--c-neutral-400);
  border-radius: var(--double-unit);
  padding: var(--triple-unit);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  &:hover,
  &:focus {
    transform: scale(1.02);
  }
`;
const CardImgWrapper = styled.div`
  position: relative;
  padding: var(--triple-unit);
  filter: brightness(50%);
`;
const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Amount = ({ amount }: { amount: string }) => {
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      [SupportedCurrency.WEI.toLowerCase()]: amount,
    },
  });
  return (
    <>
      <Text16 bold>{main}</Text16>
      <Caption color="var(--c-neutral-600)">{exponent}</Caption>
    </>
  );
};

type Props = {
  slot: EmptySlot_cardCollectionSlot;
  saleToken?: EmptySlot_token;
  readOnly: boolean;
};

export const EmptySlot = ({ slot, saleToken, readOnly }: Props) => {
  const { player, transferMarketFilters, cardPictureUrl } = slot;

  const cardLink = `${generatePath(FOOTBALL_PLAYER_SHOW_CARDS, {
    slug: player.slug,
  })}?${transferMarketFilters}`;

  const priceWei = saleToken?.liveSingleSaleOffer?.priceWei;

  return (
    <StyledLink to={cardLink}>
      <Wrapper>
        <CardImgWrapper>
          <CardImg
            width={320}
            src={saleToken?.pictureUrl || cardPictureUrl}
            alt={player.displayName}
          />
        </CardImgWrapper>
        {!readOnly && (
          <PriceWrapper>
            <Caption color="var(--c-neutral-600)">
              <FormattedMessage {...glossary.startingAt} />
            </Caption>
            {priceWei ? <Amount amount={priceWei} /> : '– –'}
          </PriceWrapper>
        )}
      </Wrapper>
      <Button color="white" small>
        <FormattedMessage {...glossary.find} />
      </Button>
    </StyledLink>
  );
};

EmptySlot.fragments = {
  cardCollectionSlot: gql`
    fragment EmptySlot_cardCollectionSlot on CardCollectionSlot {
      id
      transferMarketFilters
      cardPictureUrl
      player {
        slug
        displayName
      }
    }
  `,
  token: gql`
    fragment EmptySlot_token on Token {
      assetId
      slug
      pictureUrl
      liveSingleSaleOffer {
        id
        priceWei: price
      }
    }
  `,
};
