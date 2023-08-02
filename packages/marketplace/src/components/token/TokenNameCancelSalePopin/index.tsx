import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';
import { format as formatSeason } from '@sorare/core/src/lib/seasons';

import { TokenNameCancelSalePopin_token } from './__generated__/index.graphql';

const TokenInfo = styled.div`
  display: flex;
  color: var(--c-neutral-600);
`;

interface Props {
  token: TokenNameCancelSalePopin_token;
}

export const TokenNameCancelSalePopin = ({ token }: Props) => {
  const { metadata, sport } = token;
  const {
    rarity,
    playerDisplayName,
    seasonStartYear: startYear,
    serialNumber,
    singleCivilYear,
  } = metadata;

  return (
    <>
      <Title6>{playerDisplayName}</Title6>
      <TokenInfo>
        <Text14>
          {formatSeason(
            {
              startYear,
            },
            {
              singleCivilYear,
            }
          )}
        </Text14>
        &nbsp;-&nbsp;
        <Text14>
          {getHumanReadableSerialNumber({ rarity, serialNumber, sport })}
        </Text14>
      </TokenInfo>
    </>
  );
};

TokenNameCancelSalePopin.fragments = {
  token: gql`
    fragment TokenNameCancelSalePopin_token on Token {
      assetId
      slug
      sport
      metadata {
        ... on TokenCardMetadataInterface {
          id
          playerDisplayName
          rarity
          seasonStartYear
          serialNumber
          singleCivilYear
        }
      }
    }
  ` as TypedDocumentNode<TokenNameCancelSalePopin_token>,
};

export default TokenNameCancelSalePopin;
