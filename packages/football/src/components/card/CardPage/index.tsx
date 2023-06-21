import { gql } from '@apollo/client';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  Collection,
  Rarity,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import Block from '@sorare/core/src/atoms/layout/Block';
import BlockHeader from '@sorare/core/src/atoms/layout/BlockHeader';
import RarityGradientBackground from '@sorare/core/src/atoms/layout/RarityGradientBackground';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title3 } from '@sorare/core/src/atoms/typography';
import CreateDeckDialog from '@sorare/core/src/components/deck/CreateDeckDialog';
import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import { useSeoContext } from '@sorare/core/src/contexts/seo';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';
import { theme } from '@sorare/core/src/style/theme';

import BidHistory from '@sorare/marketplace/src/components/auction/BidHistory';
import OpenAuction from '@sorare/marketplace/src/components/auction/OpenAuction';
import MinimumPrice from '@sorare/marketplace/src/components/directOffer/MinimumPrice';
import CurrentOwner from '@sorare/marketplace/src/components/offer/CurrentOwner';
import SingleSaleOffer from '@sorare/marketplace/src/components/offer/SingleSaleOffer';
import TokenPriceHistory from '@sorare/marketplace/src/components/price/TokenPriceHistory';
import OwnershipHistory from '@sorare/marketplace/src/components/token/OwnershipHistory';
import BlockchainInfo from '@sorare/marketplace/src/components/token/TokenPage/BlockchainInfo';
import TokensAvailableOnPrimaryWhenInsufficientFundsInWallet from '@sorare/marketplace/src/components/token/TokenPage/TokensAvailableOnPrimaryWhenInsufficientFundsInWallet';
import { tokenPageMessages } from '@sorare/marketplace/src/components/token/TokenPage/tokenPageMessages';
import TokenWithdrawal from '@sorare/marketplace/src/components/token/TokenWithdrawal';

import AddCardToDeck from '@football/components/deck/AddCardToDeck';
import LastScores from '@football/components/stats/LastScores';

import CardAttributes from './CardAttributes';
import CommonCardCurrentOwner from './CommonCardCurrentOwner';
import Header from './Header';
import ItemEligibility from './ItemEligibility';
import MyOffers from './MyOffers';
import Title from './Title';
import { CardPage_card } from './__generated__/index.graphql';

type Props = {
  card: CardPage_card | undefined | null;
  slug: string;
  loadMoreBids: (
    reload: boolean,
    variable: { bidCursor: string }
  ) => Promise<any>;
  loading?: boolean;
  InfiniteScrollLoader?: ReactNode;
};
const InnerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  padding: calc(9 * var(--unit)) var(--double-unit) var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    flex-direction: row;
    align-items: flex-start;
    padding: calc(10 * var(--unit)) var(--double-unit) var(--double-unit);
  }
`;
const PageWrapper = styled(Container)`
  ${InnerContainer} {
    padding: calc(5 * var(--unit)) 0 var(--double-unit);
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  color: var(--c-neutral-1000);
  min-width: 66%;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: 66%;
  }
`;
const PageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const CardPage = (props: Props) => {
  const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
  const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
  const { card, loadMoreBids, loading, slug, InfiniteScrollLoader } = props;
  const { setPageMetadata } = useSeoContext();
  const { formatMessage } = useIntl();
  const bgLocation = useBgLocation();

  const isModale = !!bgLocation;
  const OuterContainer = isModale ? Fragment : PageWrapper;

  useEffect(() => {
    if (card) {
      return setPageMetadata(card.name, { img: card?.pictureUrlForTwitter });
    }
    return () => {};
  }, [card, setPageMetadata]);

  if (!card || card.slug !== slug) {
    return <LoadingIndicator fullHeight />;
  }

  const { token, lastFifteenSo5AverageScore, lastFiveSo5AverageScore, rarity } =
    card;

  return (
    <RarityGradientBackground rarity={rarity}>
      <OuterContainer>
        <InnerContainer>
          <Header card={card} />
          <Content>
            <Title
              card={card}
              loading={loading}
              onAddToListClick={() => setAddToListDialogOpen(true)}
            />
            <div>
              {token ? (
                <CurrentOwner token={token} />
              ) : (
                <CommonCardCurrentOwner card={card} />
              )}
              {token && <MinimumPrice token={token} />}
            </div>
            {token?.latestEnglishAuction?.open && (
              <>
                <div>
                  <OpenAuction auction={token.latestEnglishAuction} />
                </div>
                {token.latestEnglishAuction?.bids && (
                  <PageBlock>
                    <Title3>
                      <FormattedMessage
                        {...tokenPageMessages.bidCount}
                        values={{
                          count: token.latestEnglishAuction.bids.totalCount,
                        }}
                      />
                    </Title3>
                    <BidHistory
                      bids={token.latestEnglishAuction.bids}
                      loadMoreBids={loadMoreBids}
                      loading={!!loading}
                    />
                  </PageBlock>
                )}
              </>
            )}

            {token && <SingleSaleOffer token={token} />}
            {token && <MyOffers token={token} />}
            <ItemEligibility card={card} />
            <PageBlock>
              <BlockHeader
                title={
                  <FormattedMessage
                    id="CardPage.details"
                    defaultMessage="Card details"
                  />
                }
              />
              <CardAttributes card={card} />
            </PageBlock>
            {card.allSo5Scores.nodes.length > 0 && (
              <PageBlock>
                <BlockHeader
                  title={
                    <FormattedMessage
                      id="PlayerLastScores.title"
                      defaultMessage="Last scores"
                    />
                  }
                />
                <LastScores
                  player={card.player}
                  so5Scores={card.allSo5Scores.nodes}
                  lastFifteenSo5AverageScore={lastFifteenSo5AverageScore}
                  lastFiveSo5AverageScore={lastFiveSo5AverageScore}
                  InfiniteScrollLoader={InfiniteScrollLoader}
                />
              </PageBlock>
            )}
            {token && !token.latestEnglishAuction?.open && (
              <TokensAvailableOnPrimaryWhenInsufficientFundsInWallet
                sport={Sport.FOOTBALL}
                hitsPerRow={2}
                token={token}
              />
            )}
            {((token && token.metadata.rarity !== Rarity.unique) ||
              card.rarity === Rarity.common) && (
              <PageBlock>
                <BlockHeader
                  title={
                    <FormattedMessage
                      {...tokenPageMessages.last5Sales}
                      values={{
                        rarity: formatMessage(
                          scarcityMessages[
                            token?.metadata.rarity || Rarity.limited
                          ]
                        ),
                      }}
                    />
                  }
                />
                <TokenPriceHistory
                  context="card_page"
                  token={{
                    slug: card.slug,
                    collection: token?.collection || Collection.FOOTBALL,
                    metadata: {
                      rarity: token?.metadata.rarity || Rarity.limited,
                      playerSlug: card.player.slug,
                    },
                  }}
                />
              </PageBlock>
            )}
            {token && (
              <PageBlock>
                <BlockHeader
                  title={formatMessage(tokenPageMessages.blockchainInfoTitle)}
                />
                <Block>
                  {token && <BlockchainInfo token={token} />}
                  {token && <TokenWithdrawal token={token} />}
                </Block>
              </PageBlock>
            )}
            {token && (
              <OwnershipHistory
                title={
                  <BlockHeader
                    title={formatMessage(
                      tokenPageMessages.ownershipHistoryTitle
                    )}
                  />
                }
                token={token}
              />
            )}
          </Content>
        </InnerContainer>
      </OuterContainer>
      {addToListDialogOpen && (
        <AddCardToDeck
          card={card}
          onClose={() => setAddToListDialogOpen(false)}
          addList={() => {
            setAddToListDialogOpen(false);
            setCreateListDialogOpen(true);
          }}
        />
      )}
      {createListDialogOpen && (
        <CreateDeckDialog
          open
          onClose={() => {
            setAddToListDialogOpen(true);
            setCreateListDialogOpen(false);
          }}
        />
      )}
    </RarityGradientBackground>
  );
};

CardPage.fragments = {
  card: gql`
    fragment CardPage_card on Card {
      slug
      assetId
      lastFiveSo5AverageScore: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE)
      lastFifteenSo5AverageScore: averageScore(
        type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
      )
      allSo5Scores(first: 26, after: $scoreCursor) {
        nodes {
          id
          ...LastScores_so5Score
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      player {
        slug
        ...LastScores_player
      }
      token {
        assetId
        slug
        collection
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
        latestEnglishAuction {
          id
          open
          cancelled
          endDate
          bestBid {
            id
            bidder {
              ... on User {
                slug
              }
            }
          }
          bids(first: 5, after: $bidCursor) {
            ...BidHistory_tokenBidConnection
          }
          ...OpenAuction_auction
        }
        ...SingleSaleOffer_token
        ...CurrentOwner_token
        ...OwnershipHistory_token
        ...BlockchainInfo_token
        ...MinimumPrice_token
        ...TokenWithdrawal_token
        ...TokensAvailableOnPrimaryWhenInsufficientFundsInWallet_token
        ...MyOffers_token
      }
      ...CardPageHeader_card
      ...CommonCardCurrentOwner_card
      ...CardPageTitle_card
      ...CardAttributes_card
      ...Analytics_cardInfo
      ...CardPage_ItemEligibility_card
      ...AddCardToDeck_card
    }
    ${LastScores.fragments.player}
    ${LastScores.fragments.so5Score}
    ${Header.fragments.card}
    ${Title.fragments.card}
    ${CommonCardCurrentOwner.fragments.card}
    ${MyOffers.fragments.token}
    ${MinimumPrice.fragments.token}
    ${OpenAuction.fragments.auction}
    ${CardAttributes.fragments.card}
    ${TokenWithdrawal.fragments.token}
    ${analyticsFragments.cardInfo}
    ${BidHistory.fragments.bid}
    ${OwnershipHistory.fragments.token}
    ${SingleSaleOffer.fragments.token}
    ${CurrentOwner.fragments.token}
    ${BlockchainInfo.fragments.token}
    ${ItemEligibility.fragments.card}
    ${TokensAvailableOnPrimaryWhenInsufficientFundsInWallet.fragments.token}
    ${AddCardToDeck.fragments.card}
  `,
};

export default CardPage;
