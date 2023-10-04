import { TypedDocumentNode, gql } from '@apollo/client';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title6 } from '@sorare/core/src/atoms/typography';
import {
  MY_SORARE_AUCTIONS,
  MY_SORARE_FOLLOWS,
  MY_SORARE_OFFERS_RECEIVED,
  MY_SORARE_OFFERS_SENT,
  MY_SORARE_PURCHASES,
  MY_SORARE_SALES,
} from '@sorare/core/src/constants/routes';
import EmptyContent from '@sorare/core/src/contexts/intl/EmptyContent';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { Subscription } from '@marketplace/components/Subscription';
import { Auction } from '@marketplace/components/auction/Auction';
import { Sale } from '@marketplace/components/sale/Sale';
import { tokenAuctionSubscription } from '@marketplace/lib/fragments';

import MyPage from '../MyPage';
import DirectOffer from '../common/DirectOffer';
import DisplayItems from '../common/DisplayItems';
import Follow from '../common/Follow';
import Subscriptions from '../common/Subscriptions';
import { MyViccPage } from '../common/pages';
import {
  MyNewsQuery,
  MyNewsQueryVariables,
  onNewsOfferUpdated,
  onNewsOfferUpdatedVariables,
} from './__generated__/index.graphql';

const MY_NEWS_QUERY = gql`
  query MyNewsQuery {
    currentUser {
      slug
      buyingAuctions {
        id
        ...Auction_auction
      }
      liveSingleSaleOffers(first: 2) {
        totalCount
        nodes {
          id
          ...Sale_offer
        }
      }
      boughtSingleSaleOffers(first: 2) {
        totalCount
        nodes {
          id
          ...Sale_offer
        }
      }
      pendingOffersReceived(first: 1) {
        totalCount
        nodes {
          id
          ...MyViccDirectOffer_tokenOffer
        }
      }
      pendingOffersSent(first: 1) {
        totalCount
        nodes {
          id
          ...MyViccDirectOffer_tokenOffer
        }
      }
      mySubscriptions(types: [TEAM, COUNTRY, PLAYER], first: 2) {
        nodes {
          slug
          updatedAt
          ...Subscriptions_subscription
        }
      }
    }
  }
  ${DirectOffer.fragments.tokenOffer}
  ${Subscriptions.fragments.subscription}
  ${Auction.fragments.auction}
  ${Sale.fragments.offer}
` as TypedDocumentNode<MyNewsQuery, MyNewsQueryVariables>;

const OFFER_SUBSCRIPTION = gql`
  subscription onNewsOfferUpdated {
    tokenOfferWasUpdated {
      id
      ...MyViccDirectOffer_tokenOffer
    }
  }
  ${DirectOffer.fragments.tokenOffer}
` as TypedDocumentNode<onNewsOfferUpdated, onNewsOfferUpdatedVariables>;

const messages = defineMessages({
  auctions: {
    id: 'MyNews.auctions',
    defaultMessage: 'Recent bids',
  },
  sales: {
    id: 'MyNews.sales',
    defaultMessage: 'Latest sales',
  },
  purchases: {
    id: 'MyNews.purchases',
    defaultMessage: 'Latest players bought',
  },
  offerReceived: {
    id: 'MyNews.offerReceived',
    defaultMessage: 'Latest offer received',
  },
  offerSent: {
    id: 'MyNews.offerSent',
    defaultMessage: 'Latest offer sent',
  },
  follows: {
    id: 'MyNews.follows',
    defaultMessage: 'Latest follows',
  },
});

type Section = keyof typeof messages;

const emptyMessages = defineMessages<Section>({
  auctions: {
    id: 'MyNews.emptyAuctions',
    defaultMessage: 'No recent bids',
  },
  sales: {
    id: 'MyNews.emptySales',
    defaultMessage: 'No latest sales',
  },
  purchases: {
    id: 'MyNews.emptyPurchases',
    defaultMessage: 'No latest players bought',
  },
  offerReceived: {
    id: 'MyNews.emptyOfferReceived',
    defaultMessage: 'No latest offer received',
  },
  offerSent: {
    id: 'MyNews.emptyOfferSent',
    defaultMessage: 'No latest offer sent',
  },
  follows: {
    id: 'MyNews.emptyFollows',
    defaultMessage: 'No latest follows',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;
const SectionRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const SectionHeader = ({
  title,
  link,
}: {
  title: MessageDescriptor;
  link: string;
}) => {
  return (
    <HeaderContainer>
      <Title6 as="h6">
        <FormattedMessage {...title} />
      </Title6>
      <Button small color="white" component={Link} to={link}>
        <FormattedMessage id="MyNews.viewAll" defaultMessage="View All" />
      </Button>
    </HeaderContainer>
  );
};

const PlaceHolderFor = ({ message }: { message: Section }) => (
  <EmptyContent message={emptyMessages[message]} />
);

const MyNews = () => {
  const { loading, data } = useQuery(MY_NEWS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  if (!data && loading) {
    return <LoadingIndicator />;
  }

  const offerReceived = data?.currentUser?.pendingOffersReceived;
  const offerSent = data?.currentUser?.pendingOffersSent;
  const auctions = data?.currentUser?.buyingAuctions;
  const sales = data?.currentUser?.liveSingleSaleOffers;
  const purchases = data?.currentUser?.boughtSingleSaleOffers;
  const follows = data?.currentUser?.mySubscriptions;

  const hasAuctions = auctions && auctions?.length >= 1;
  const hasSales = sales && sales.totalCount >= 1;
  const hasPurchases = purchases && purchases.totalCount >= 1;
  const hasOfferReceived = offerReceived && offerReceived.totalCount >= 1;
  const hasOfferSent = offerSent && offerSent.totalCount >= 1;
  const hasFollows = follows && follows.nodes.length >= 1;

  return (
    <MyPage page={MyViccPage.NEW}>
      <Subscription gql={OFFER_SUBSCRIPTION} />
      <Subscription gql={tokenAuctionSubscription} />
      <Root>
        <SectionRoot>
          <SectionHeader title={messages.auctions} link={MY_SORARE_AUCTIONS} />
          {hasAuctions ? (
            <DisplayItems
              items={auctions?.map(auction => (
                <Auction key={auction.id} auction={auction} />
              ))}
            />
          ) : (
            <PlaceHolderFor message="auctions" />
          )}
        </SectionRoot>
        <SectionRoot>
          <SectionHeader title={messages.sales} link={MY_SORARE_SALES} />
          {hasSales ? (
            <DisplayItems
              items={sales?.nodes.map(sale => (
                <Sale key={sale.id} sale={sale} />
              ))}
            />
          ) : (
            <PlaceHolderFor message="sales" />
          )}
        </SectionRoot>
        <SectionRoot>
          <SectionHeader
            title={messages.purchases}
            link={MY_SORARE_PURCHASES}
          />
          {hasPurchases && purchases ? (
            <DisplayItems
              items={purchases.nodes.map(purchase => (
                <Sale key={purchase.id} sale={purchase} />
              ))}
            />
          ) : (
            <PlaceHolderFor message="purchases" />
          )}
        </SectionRoot>
        <SectionRoot>
          <SectionHeader
            title={messages.offerReceived}
            link={MY_SORARE_OFFERS_RECEIVED}
          />
          {hasOfferReceived && offerReceived ? (
            <DisplayItems
              items={offerReceived.nodes.map(item => (
                <DirectOffer key={item!.id} offer={item!} />
              ))}
            />
          ) : (
            <PlaceHolderFor message="offerReceived" />
          )}
        </SectionRoot>
        <SectionRoot>
          <SectionHeader
            title={messages.offerSent}
            link={MY_SORARE_OFFERS_SENT}
          />
          {hasOfferSent && offerSent ? (
            <DisplayItems
              items={offerSent.nodes.map(item => (
                <DirectOffer key={item!.id} offer={item!} />
              ))}
            />
          ) : (
            <PlaceHolderFor message="offerSent" />
          )}
        </SectionRoot>
        <SectionRoot>
          <SectionHeader title={messages.follows} link={MY_SORARE_FOLLOWS} />
          {hasFollows ? (
            <Subscriptions
              subscriptions={follows.nodes}
              ItemComponent={Follow}
            />
          ) : (
            <PlaceHolderFor message="follows" />
          )}
        </SectionRoot>
      </Root>
    </MyPage>
  );
};
export default MyNews;
