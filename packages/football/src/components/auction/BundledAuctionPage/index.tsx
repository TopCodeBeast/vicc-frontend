import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Body from '@sorare/core/src/atoms/layout/Body';
import ResponsiveRow from '@sorare/core/src/atoms/layout/ResponsiveRow';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title2, Title3 } from '@sorare/core/src/atoms/typography';
import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import BidHistory from '@sorare/marketplace/src/components/auction/BidHistory';
import OpenAuction from '@sorare/marketplace/src/components/auction/OpenAuction';
import MultiCardPageContent, {
  Section,
} from '@sorare/marketplace/src/components/market/MultiCardPageContent';
import CardPreview from '@sorare/marketplace/src/components/starterbundle/CardPreview';
import FlexToken from '@sorare/marketplace/src/components/token/FlexToken';
import { tokenPageMessages } from '@sorare/marketplace/src/components/token/TokenPage/tokenPageMessages';

import RelatedTeam from '@football/components/club/RelatedTeam';
import CardProperties from '@football/components/so5/CardProperties';

import BundledAuctionTitle from './BundledAuctionTitle';
import {
  BundledAuctionCardsQuery,
  BundledAuctionCardsQueryVariables,
  BundledAuctionQuery,
  BundledAuctionQueryVariables,
} from './__generated__/index.graphql';

const messages = defineMessages({
  relatedPage: {
    id: 'BundledAuction.relatedPage',
    defaultMessage: 'Related page',
  },
  items: {
    id: 'BundledAuction.items',
    defaultMessage: '{count, number} items',
  },
});

const BidsHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const BUNDLED_AUCTION_QUERY = gql`
  query BundledAuctionQuery($id: String!, $bidCursor: String) {
    tokens {
      auction(id: $id) {
        id
        team
        ...OpenAuction_auction
        nfts {
          assetId
          slug
          ...FlexToken_token
          ...CardPreview_token
        }
        bids(first: 5, after: $bidCursor) {
          ...BidHistory_tokenBidConnection
        }
      }
    }
  }
  ${OpenAuction.fragments.auction}
  ${FlexToken.fragments.token}
  ${CardPreview.fragments.token}
  ${BidHistory.fragments.bid}
`;

export const BUNDLED_AUCTION_CARDS_QUERY = gql`
  query BundledAuctionCardsQuery($slugs: [String!]!) {
    football {
      cards(slugs: $slugs) {
        slug
        assetId
        ...Analytics_cardInfo
        ...CardProperties_card
        ...BundledAuctionTitle_card
        team {
          ... on TeamInterface {
            slug
          }
          ...RelatedTeam_team
        }
      }
    }
  }
  ${analyticsFragments.cardInfo}
  ${CardProperties.fragments.card}
  ${RelatedTeam.fragments.team}
  ${BundledAuctionTitle.fragments.card}
`;

export const BundledAuctionPage = () => {
  const { id } = useParams();

  const {
    data,
    loading,
    loadMore: loadMoreBids,
  } = usePaginatedQuery<BundledAuctionQuery, BundledAuctionQueryVariables>(
    BUNDLED_AUCTION_QUERY,
    {
      variables: {
        id: id!,
      },
      skip: !id,
      connection: 'TokenBidConnection',
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );

  const { data: dataCards, loading: loadingCards } = useQuery<
    BundledAuctionCardsQuery,
    BundledAuctionCardsQueryVariables
  >(BUNDLED_AUCTION_CARDS_QUERY, {
    variables: {
      slugs: data?.tokens.auction.nfts.map(token => token.slug) || [],
    },
    skip: !data?.tokens.auction,
  });

  if (loading || loadingCards) return <LoadingIndicator fullHeight />;

  const auction = data?.tokens.auction;
  const cards = dataCards?.football.cards;

  if (!auction || !cards) return null;

  const { team } = cards[0];
  const { nfts, bids } = auction;

  return (
    <Body color="white">
      <MultiCardPageContent
        cardsPreview={
          <>
            {nfts.map(token => (
              <FlexToken key={token.assetId} token={token} />
            ))}
          </>
        }
        detailsContent={
          <>
            <BundledAuctionTitle
              team={auction.team}
              cards={cards}
              Variant={Title2}
            />
            <Section>
              <OpenAuction auction={auction} />
            </Section>
            {bids && bids.totalCount > 0 && (
              <Section>
                <BidsHistory>
                  <Title3>
                    <FormattedMessage
                      {...tokenPageMessages.bidCount}
                      values={{
                        count: bids.totalCount,
                      }}
                    />
                  </Title3>
                  <BidHistory
                    bids={bids}
                    loadMoreBids={loadMoreBids}
                    loading={false}
                  />
                </BidsHistory>
              </Section>
            )}
            <Section>
              <Title3>
                <FormattedMessage
                  id="BundledAuction.cards"
                  defaultMessage="In this bundle"
                />
              </Title3>
              <ResponsiveRow>
                {auction.nfts.map(nft => {
                  const card = cards.find(
                    ({ assetId }) => assetId === nft.assetId
                  );
                  if (!card) return null;
                  return (
                    <CardPreview
                      key={nft.assetId}
                      token={nft}
                      cardProperties={<CardProperties card={card} />}
                    />
                  );
                })}
              </ResponsiveRow>
            </Section>
            <Section>
              <Title3>
                <FormattedMessage {...messages.relatedPage} />
              </Title3>
              <RelatedTeam team={team} fullWidth />
            </Section>
          </>
        }
      />
    </Body>
  );
};

export default BundledAuctionPage;
