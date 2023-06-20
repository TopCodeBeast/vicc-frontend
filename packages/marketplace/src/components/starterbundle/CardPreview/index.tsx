import { gql } from '@apollo/client';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14, Text18 } from '@sorare/core/src/atoms/typography';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';
import { theme } from '@sorare/core/src/style/theme';

import FlexToken from 'components/token/FlexToken';
import { useMarketplaceContext } from 'contexts/Marketplace';

import { CardPreview_token } from './__generated__/index.graphql';

const CardContainer = styled.div`
  height: 100%;
  display: flex;
  padding: var(--double-unit);
  background-color: var(--c-neutral-300);
  flex: 1;
  border-radius: ${theme.shape.borderRadius}px;
  flex-direction: column;
  gap: var(--unit);
`;
const CardInfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--double-unit);
`;
const PlayerName = styled(Text18)`
  color: var(--c-neutral-1000);
`;
const TokenDetails = styled(Text14)`
  color: var(--c-neutral-1000);
`;

const CardPreview = ({
  token,
  cardPositions,
  cardProperties,
}: {
  token: CardPreview_token;
  cardPositions?: ReactNode;
  cardProperties: ReactNode;
}) => {
  const { trackClickCard } = useMarketplaceContext();

  return (
    <OpenItemDialogLink
      item={token}
      onClick={() => trackClickCard(token.assetId, token.sport)}
      sport={token.sport}
    >
      <CardContainer key={token.assetId}>
        <FlexToken token={token} />
        <CardInfoContainer>
          {cardProperties}
          <div>
            <PlayerName>
              <strong>{token.metadata.playerDisplayName}</strong>
            </PlayerName>
            <TokenDetails>
              {cardPositions}
              {getHumanReadableSerialNumber({
                rarity: token.metadata.rarity,
                serialNumber: token.metadata.serialNumber,
                sport: token.sport,
                separator: ' • ',
              })}
            </TokenDetails>
          </div>
        </CardInfoContainer>
      </CardContainer>
    </OpenItemDialogLink>
  );
};

CardPreview.fragments = {
  token: gql`
    fragment CardPreview_token on Token {
      assetId
      slug
      sport
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          rarity
          serialNumber
          playerDisplayName
        }
      }
      ...FlexToken_token
    }
    ${FlexToken.fragments.token}
  `,
};

export default CardPreview;
