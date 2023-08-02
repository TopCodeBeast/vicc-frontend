import { TypedDocumentNode, gql } from '@apollo/client';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useMeasure } from 'react-use';
import styled from 'styled-components';

import { ScarcityBackground } from '@sorare/core/src/atoms/layout/ScarcityBackground';
import UninteractiveToken from '@sorare/core/src/components/token/UninteractiveToken';
import { CARD_BORDER_RADIUS } from '@sorare/core/src/lib/cards';

import { PrimaryOfferTokensPreview_token } from './__generated__/index.graphql';

const RemainingCardsPlaceholderWrapper = styled.div`
  width: 100%;
`;

const RemainingCardsPlaceholder = styled(ScarcityBackground)`
  width: 100%;
  height: auto;
  position: relative;
  border-radius: ${CARD_BORDER_RADIUS};

  aspect-ratio: var(--card-aspect-ratio);
`;

const RemainingCardsText = styled.p<{ parentWidth?: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  --baseFontSize: 36px;
  --baseCardWidth: 90;

  line-height: 100%;
  font-weight: var(--t-bold);
  color: rgba(0, 0, 0, 0.85);
  font-size: calc(
    var(--baseFontSize) * ${({ parentWidth }) => parentWidth} /
      var(--baseCardWidth)
  );
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1);
`;

type Props = {
  nfts: PrimaryOfferTokensPreview_token[];
};

export const PrimaryOfferTokensPreview = ({ nfts }: Props) => {
  const offerSize = nfts.length;
  const [measurementDiv, { width: remainingCardsPlaceholderWidth }] =
    useMeasure<HTMLDivElement>();

  // We want to display a maximum of 5 cards in the preview
  const cardsPreview = useMemo(() => {
    if (offerSize > 5) {
      return nfts.slice(0, 4);
    }
    return nfts;
  }, [nfts, offerSize]);

  const nbRemainingCards = offerSize - cardsPreview.length;

  return (
    <>
      {cardsPreview.map((token, index) => (
        <UninteractiveToken
          token={token}
          key={token.assetId}
          {...(index > 0 && { width: 160 })}
        />
      ))}
      {nbRemainingCards > 0 && (
        <RemainingCardsPlaceholderWrapper ref={measurementDiv}>
          <RemainingCardsPlaceholder
            className={classNames(nfts[4]?.sport, nfts[4]?.metadata.rarity)}
          >
            <RemainingCardsText parentWidth={remainingCardsPlaceholderWidth}>
              +{nbRemainingCards}
            </RemainingCardsText>
          </RemainingCardsPlaceholder>
        </RemainingCardsPlaceholderWrapper>
      )}
    </>
  );
};

PrimaryOfferTokensPreview.fragments = {
  token: gql`
    fragment PrimaryOfferTokensPreview_token on Token {
      slug
      sport
      assetId
      collection
      metadata {
        ... on TokenCardMetadataInterface {
          id
          rarity
        }
      }
      ...UninteractiveToken_token
    }
    ${UninteractiveToken.fragments.token}
  ` as TypedDocumentNode<PrimaryOfferTokensPreview_token>,
};
