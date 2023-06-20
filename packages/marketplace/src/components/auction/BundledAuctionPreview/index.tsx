import { gql } from '@apollo/client';
import classNames from 'classnames';
import styled from 'styled-components';

import { Title4 } from '@sorare/core/src/atoms/typography';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import { useEventContext } from '@sorare/core/src/contexts/event';

import { CardCount } from 'components/ItemPreview/ui';
import FlexToken from 'components/token/FlexToken';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import { BundledAuctionPreview_auction } from './__generated__/index.graphql';

type Props = {
  bundledAuction: BundledAuctionPreview_auction;
  noMargin?: boolean;
  displayOneCard?: boolean;
};

const BundlePreviewContainer = styled.div`
  position: relative;
  margin-bottom: var(--intermediate-unit);
  &.noMargin {
    margin-bottom: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: var(--unit);
  aspect-ratio: var(--card-aspect-ratio);
`;

const OverlayContainer = styled.div`
  position: relative;
  pointer-events: auto;
`;

const Cell = styled.div`
  &:nth-of-type(3),
  &:nth-of-type(4) {
    display: flex;
    align-items: flex-end;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: white;
  border-radius: var(--unit);
  pointer-events: none;
`;

const RelativeContainer = styled.div`
  position: relative;
`;

export const BundledAuctionPreview = ({
  bundledAuction,
  noMargin,
  displayOneCard,
}: Props) => {
  const { trackClickBundle } = useMarketplaceContext();
  const trackingContext = useEventContext();
  const { nfts } = bundledAuction;

  if (displayOneCard) {
    return (
      <OpenItemDialogLink
        item={bundledAuction}
        sport={bundledAuction.nfts[0].sport}
      >
        <RelativeContainer>
          <FlexToken token={bundledAuction.nfts[0]} width={160} />
          <CardCount as="div">x{bundledAuction.nfts.length}</CardCount>
        </RelativeContainer>
      </OpenItemDialogLink>
    );
  }

  return (
    <BundlePreviewContainer className={classNames({ noMargin })}>
      <OpenItemDialogLink
        item={bundledAuction}
        onClick={() =>
          trackClickBundle(
            bundledAuction.id,
            nfts.map(nft => nft.assetId),
            nfts[0].sport,
            trackingContext?.subPath
          )
        }
        sport={nfts[0].sport}
      >
        <Grid>
          {nfts.slice(0, 4).map((nft, i) => {
            return (
              <Cell key={nft.assetId}>
                <OverlayContainer>
                  <FlexToken token={nft} width={160} />
                  {nfts.length > 4 && i === 3 && (
                    <Overlay>
                      <Title4>+{nfts.length - 4}</Title4>
                    </Overlay>
                  )}
                </OverlayContainer>
              </Cell>
            );
          })}
        </Grid>
      </OpenItemDialogLink>
    </BundlePreviewContainer>
  );
};

const tokenFragment = gql`
  fragment BundledAuctionPreview_token on Token {
    assetId
    slug
    sport
    ...FlexToken_token
  }
  ${FlexToken.fragments.token}
`;

BundledAuctionPreview.fragments = {
  token: tokenFragment,
  auction: gql`
    fragment BundledAuctionPreview_auction on TokenAuction {
      id
      blockchainId
      nfts {
        assetId
        slug
        sport
        ...BundledAuctionPreview_token
      }
    }
    ${tokenFragment}
  `,
};
