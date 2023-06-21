import { gql } from '@apollo/client';
import { ReactNode } from 'react';

import { getHumanReadableSerialNumber } from '@core/lib/cards';
import { format } from '@core/lib/seasons';

import { TokenDescription_tokenMetas } from './__generated__/index.graphql';

interface Props {
  token: TokenDescription_tokenMetas;
  separator?: ReactNode;
}

const TokenMetas = ({ token, separator }: Props) => {
  const { metadata, sport } = token;
  return (
    <span>
      {format(
        {
          startYear: metadata.seasonStartYear,
        },
        { singleCivilYear: metadata.singleCivilYear }
      )}
      {separator}
      {getHumanReadableSerialNumber({
        rarity: metadata.rarity,
        serialNumber: metadata.serialNumber,
        sport,
      })}
    </span>
  );
};

TokenMetas.fragments = {
  token: gql`
    fragment TokenDescription_tokenMetas on Token {
      slug
      assetId
      sport
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          playerDisplayName
          playerSlug
          rarity
          seasonStartYear
          serialNumber
          singleCivilYear
        }
      }
    }
  `,
};

export default TokenMetas;
