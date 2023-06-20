import { gql } from '@apollo/client';
import { Collapse } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Title5 } from '@sorare/core/src/atoms/typography';
import { TinyCardsPreviewContainer } from '@sorare/core/src/components/bundled/CardsPreviewContainer';
import { supportedScarcities } from '@sorare/core/src/components/card/ScarcityBall';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { scarcityNames } from '@sorare/core/src/lib/cards';

import { PrimaryOfferTokensPreview } from 'components/primaryOffer/PrimaryOfferTokensPreview';
import FlexToken from 'components/token/FlexToken';
import TokenDescription from 'components/token/TokenDescription';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import TokenDrawerSummary from '../TokenDrawerSummary';
import { TokensSummary_token } from './__generated__/index.graphql';

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Row = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Image = styled.div`
  flex-shrink: 0;
  width: calc(6 * var(--unit));
`;
const Title = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

const Preview = styled.div`
  flex-shrink: 0;
  width: calc(10 * var(--unit));
`;

const Metas = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
`;

const Gap = styled.div`
  height: var(--double-unit);
  display: inline-block;
`;
const TokensInPack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  justify-content: flex-start;
`;

const Line = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  padding: var(--unit);
  border-radius: var(--unit);
  background-color: var(--c-neutral-200);
`;

const Button = styled.button`
  display: inline-flex;
`;

type Props = {
  tokens: TokensSummary_token[];
  title?: ReactNode;
  packTitle: ReactNode;
  price?: ReactNode;
};

const TokenInPack = ({ token }: { token: TokensSummary_token }) => {
  const { TokenPropertiesComponent } = useMarketplaceContext();
  return (
    <Line>
      <Image>
        <FlexToken width={80} token={token} withLink />
      </Image>
      <Metas>
        <TokenPropertiesComponent assetId={token.assetId} />
        <TokenDescription token={token} />
      </Metas>
    </Line>
  );
};

export const TokensSummary = ({ tokens, title, packTitle, price }: Props) => {
  const [viewPlayerInPack, setViewPlayerInPack] = useState<boolean>(false);

  const { up: isLaptop } = useScreenSize('laptop');

  const countByRarity = tokens.reduce<Record<string, number>>(
    (acc, token) => ({
      ...acc,
      [token.metadata.rarity]: (acc[token.metadata.rarity] || 0) + 1,
    }),
    {}
  );
  const packDetails = supportedScarcities
    .map(
      scarcity =>
        countByRarity[scarcity] &&
        `${countByRarity[scarcity]} ${scarcityNames[scarcity]}`
    )
    .filter(Boolean);

  return (
    <div>
      <Summary>
        {title}
        <Row>
          <Preview>
            <TinyCardsPreviewContainer>
              <PrimaryOfferTokensPreview nfts={tokens} />
            </TinyCardsPreviewContainer>
          </Preview>
          <Metas>
            <Title>{packTitle}</Title>
            <Text14 color="var(--c-neutral-600)">
              {packDetails.join(' – ')}
            </Text14>
            <Button
              type="button"
              onClick={() => setViewPlayerInPack(!viewPlayerInPack)}
            >
              <Text14 as="span" color="var(--c-brand-600)">
                <FormattedMessage
                  id="tokensSummary.cardsInPack.cta"
                  defaultMessage="View cards in pack"
                />
              </Text14>
            </Button>
          </Metas>
          {price}
        </Row>
      </Summary>
      {!isLaptop ? (
        <TokenDrawerSummary
          open={viewPlayerInPack}
          onBackdropClick={() => setViewPlayerInPack(false)}
          title={
            <Title5>
              <FormattedMessage
                id="tokensSummary.cardsInPack.title"
                defaultMessage="Cards in pack"
              />
            </Title5>
          }
        >
          <TokensInPack>
            {tokens.map(token => (
              <TokenInPack key={token.assetId} token={token} />
            ))}
          </TokensInPack>
        </TokenDrawerSummary>
      ) : (
        <Collapse in={viewPlayerInPack} collapsedSize={0}>
          <Gap />
          <TokensInPack>
            {tokens.map(token => (
              <TokenInPack key={token.assetId} token={token} />
            ))}
          </TokensInPack>
        </Collapse>
      )}
    </div>
  );
};

TokensSummary.fragments = {
  token: gql`
    fragment TokensSummary_token on Token {
      assetId
      slug
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          rarity
        }
      }
      ...TokenDescription_token
      ...FlexToken_token
      ...PrimaryOfferTokensPreview_token
    }
    ${TokenDescription.fragments.token}
    ${PrimaryOfferTokensPreview.fragments.token}
    ${FlexToken.fragments.token}
  `,
};

export default TokensSummary;
