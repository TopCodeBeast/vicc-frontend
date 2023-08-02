import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';

import {
  ItemImgContainer,
  ItemInfosContainer,
} from '@marketplace/components/ItemPreview/ui';
import FlexToken from '@marketplace/components/token/FlexToken';
import TokenDescription from '@marketplace/components/token/TokenDescription';

import { SaleDetails } from './SaleDetails';
import { Sale_offer } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
`;

type Props = {
  sale: Sale_offer;
};

export const Sale = ({ sale }: Props) => {
  const token = sale.senderSide.nfts[0];

  return (
    <Root>
      <ItemImgContainer>
        <FlexToken token={token} withLink />
      </ItemImgContainer>
      <ItemInfosContainer>
        <TokenDescription
          token={token}
          Details={Text14}
          detailsColor="var(--c-neutral-600)"
          withDetails
          disableSportSpecific
        />
        <SaleDetails sale={sale} token={token} allowColumnLayout showFees />
      </ItemInfosContainer>
    </Root>
  );
};

Sale.fragments = {
  offer: gql`
    fragment Sale_offer on TokenOffer {
      id
      senderSide {
        id
        nfts {
          assetId
          slug
          ...FlexToken_token
          ...TokenDescription_token
          ...SaleDetails_token
        }
      }
      ...SaleDetails_offer
    }
    ${FlexToken.fragments.token}
    ${TokenDescription.fragments.token}
    ${SaleDetails.fragments.offer}
    ${SaleDetails.fragments.token}
  ` as TypedDocumentNode<Sale_offer>,
};
