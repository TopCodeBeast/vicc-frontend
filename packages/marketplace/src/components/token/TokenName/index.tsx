import { gql } from '@apollo/client';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import ScarcityBall from '@sorare/core/src/components/card/ScarcityBall';
import { LEGACY_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { appsPaths } from '@sorare/core/src/contexts/sport/Provider';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';
import { ScarcityType } from '@sorare/core/src/lib/scarcity';
import { format as formatSeason } from '@sorare/core/src/lib/seasons';

import { TokenName_token } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
`;

const Content = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

type Props = {
  token: TokenName_token;
  withLink?: boolean;
};

export const TokenName = ({ token, withLink }: Props) => {
  const { metadata, sport } = token;
  const {
    rarity,
    playerDisplayName,
    playerSlug,
    seasonStartYear: startYear,
    serialNumber,
    singleCivilYear,
  } = metadata;

  return (
    <Root key={playerSlug}>
      <ScarcityBall scarcity={rarity as ScarcityType} iconOnly />
      <Content>
        <Text16 bold>{playerDisplayName}</Text16>
        <Text16 color="var(--c-neutral-600)">
          {formatSeason({ startYear }, { singleCivilYear })} •{' '}
          {getHumanReadableSerialNumber({
            rarity,
            serialNumber,
            sport,
          })}
        </Text16>
        {withLink && (
          <Link
            to={generatePath(`${appsPaths[sport]}${LEGACY_CARD_SHOW}`, {
              slug: token.slug,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              size="sm"
              color="var(--c-neutral-500)"
            />
          </Link>
        )}
      </Content>
    </Root>
  );
};

TokenName.fragments = {
  token: gql`
    fragment TokenName_token on Token {
      assetId
      slug
      sport
      metadata {
        ... on TokenCricketMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          playerSlug
          playerDisplayName
          rarity
          seasonStartYear
          serialNumber
          singleCivilYear
        }
      }
    }
  `,
};
