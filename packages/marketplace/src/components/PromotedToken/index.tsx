import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import TokenMetas from '@sorare/core/src/components/token/TokenMetas';

import {
  ItemImgContainer,
  ItemInfosContainer,
  ItemPropertiesContainer,
} from '@marketplace/components/ItemPreview/ui';
import { TokenDetails } from '@marketplace/components/token/Token/TokenContent/TokenDetails';
import { TokenImg } from '@marketplace/components/token/Token/TokenContent/TokenImg';
import TokenFavoriteButton from '@marketplace/components/token/TokenFavoriteButton';
import useGetTokenSingleSaleDetails from '@marketplace/hooks/offers/useGetTokenSingleSaleDetails';

import { PromotedToken_token } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  overflow: hidden;
`;

const StyledItemPropertiesContainer = styled(ItemPropertiesContainer)`
  height: auto;
  justify-content: space-between;
  color: var(--c-neutral-1000);
`;

const TokenFavoriteButtonWrapper = styled.div`
  margin-left: auto;
  align-self: flex-start;
`;

const StyledItemImgContainer = styled(ItemImgContainer)`
  --image-width: var(--card-width, calc(12 * var(--unit)));
`;

const StyledCaption = styled(Caption)`
  text-align: left;
`;

type Props = {
  token: PromotedToken_token;
  CardInfo: () => React.JSX.Element | null;
  solidFavoriteIcon?: boolean;
  alwaysShowFavoriteButton?: boolean;
  className?: string;
};

export const PromotedToken = ({
  token,
  CardInfo,
  alwaysShowFavoriteButton = false,
  solidFavoriteIcon = true,
  className,
}: Props) => {
  const [hoveredItem, setHoveredItem] = useState<boolean>(false);

  return (
    <Wrapper
      className={className}
      onMouseEnter={() => setHoveredItem(true)}
      onMouseLeave={() => setHoveredItem(false)}
    >
      <StyledItemImgContainer>
        <TokenImg token={token} isDesktopLayout={false} />
      </StyledItemImgContainer>
      <ItemInfosContainer>
        <StyledItemPropertiesContainer>
          {CardInfo && <CardInfo />}
          <TokenFavoriteButtonWrapper>
            <TokenFavoriteButton
              show={alwaysShowFavoriteButton || hoveredItem}
              solid={solidFavoriteIcon}
              token={token}
            />
          </TokenFavoriteButtonWrapper>
        </StyledItemPropertiesContainer>
        <StyledCaption>
          <TokenMetas token={token} separator=" • " />
        </StyledCaption>
        <TokenDetails token={token} isDesktopLayout={false} />
      </ItemInfosContainer>
    </Wrapper>
  );
};

PromotedToken.fragments = {
  token: gql`
    fragment PromotedToken_token on Token {
      assetId
      slug
      ...TokenFavoriteButton_token
      ...TokenDetails_token
      ...TokenDescription_tokenMetas
      ...TokenImg_token
    }
    ${TokenFavoriteButton.fragments.token}
    ${useGetTokenSingleSaleDetails.fragments.token}
    ${TokenDetails.fragments.token}
    ${TokenMetas.fragments.token}
    ${TokenImg.fragments.token}
  ` as TypedDocumentNode<PromotedToken_token>,
};
