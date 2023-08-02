import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';

import PriceHistoryTooltip from '@marketplace/components/price/PriceHistoryTooltip';
import FlexToken from '@marketplace/components/token/FlexToken';
import TokenDescription from '@marketplace/components/token/TokenDescription';

import { CardOffer_token } from './__generated__/index.graphql';

type Props = {
  item: CardOffer_token;
  children?: ReactNode;
  inModale?: boolean;
};

const Container = styled(OpenItemDialogLink)`
  padding: var(--unit);
  background: var(--c-neutral-300);
  border-radius: var(--double-unit);
  transition: 0.1s ease-in-out all;
  .inModale & {
    background: var(--c-neutral-400);
  }
  &:hover {
    background: var(--c-neutral-400);
  }
`;

const CardInfo = styled.div`
  display: flex;
`;

const Card = styled.div`
  width: 40px;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  margin-left: var(--unit);
  flex-grow: 1;
  justify-content: space-between;
`;

const CardOffer = ({ item, children }: Props) => {
  return (
    <Container item={item} sport={item.sport}>
      <CardInfo>
        <Card>
          <FlexToken width={80} token={item} />
        </Card>

        <Description>
          <TokenDescription
            Title={Text16}
            Details={Text14}
            detailsColor="var(--c-neutral-600)"
            token={item}
            withoutLink
          />
          {item.metadata.rarity !== Rarity.unique && (
            <PriceHistoryTooltip token={item} />
          )}
        </Description>
      </CardInfo>
      {children}
    </Container>
  );
};

CardOffer.fragments = {
  token: gql`
    fragment CardOffer_token on Token {
      assetId
      slug
      sport
      ...FlexToken_token
      ...TokenDescription_token
      ...PriceHistoryTooltip_token
    }
    ${FlexToken.fragments.token}
    ${PriceHistoryTooltip.fragments.token}
    ${TokenDescription.fragments.token}
  ` as TypedDocumentNode<CardOffer_token>,
};

export default CardOffer;
