import { gql } from '@apollo/client';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14, Text18 } from '@sorare/core/src/atoms/typography';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';

import { CardContainer } from '@sorare/marketplace/src/components/ItemPreview/ui';
import FlexToken from '@sorare/marketplace/src/components/token/FlexToken';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import { MobileCardPreview_token } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  gap: var(--double-unit);
  padding: var(--unit);
  background: var(--c-neutral-300);
  border-radius: var(--double-unit);
`;

const CardInfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--unit);
  justify-content: center;
`;

const MobileCardPreview = ({
  token,
  cardPositions,
  cardProperties,
}: {
  token: MobileCardPreview_token;
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
      <Wrapper key={token.assetId}>
        <CardContainer>
          <FlexToken token={token} />
        </CardContainer>

        <CardInfoContainer>
          {cardProperties}
          <div>
            <Text18 bold color="var(--c-neutral-1000)">
              <strong>{token.metadata.playerDisplayName}</strong>
            </Text18>
            <Text14 color="var(--c-neutral-1000)">
              {cardPositions}
              {getHumanReadableSerialNumber({
                rarity: token.metadata.rarity,
                serialNumber: token.metadata.serialNumber,
                sport: token.sport,
                separator: ' • ',
              })}
            </Text14>
          </div>
        </CardInfoContainer>
      </Wrapper>
    </OpenItemDialogLink>
  );
};

MobileCardPreview.fragments = {
  token: gql`
    fragment MobileCardPreview_token on Token {
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

export default MobileCardPreview;
