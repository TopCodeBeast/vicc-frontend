import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import BundledAuctionName from 'components/bundled/BundledAuctionName';
import TokenDescriptionFromProps from 'components/token/TokenDescriptionFromProps';
import TokenMetas from 'components/token/TokenMetas';
import { FOOTBALL_BUNDLED_AUCTION, LEGACY_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useSportContext } from 'contexts/sport';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { AuctionNotification_auctionNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: AuctionNotification_auctionNotification;
};

const messages = defineMessages({
  card_bought: {
    id: 'Activity.Notifications.cardBought',
    defaultMessage: 'You won an auction on <b>{card}</b>',
  },
  higher_bid: {
    id: 'Activity.Notifications.higherBid',
    defaultMessage: 'Your bid on <b>{card}</b> has been outbid',
  },
});

export const AuctionNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { generateSportPath } = useSportContext();

  const { name, createdAt, tokenAuction, auction, sport, read } = notification;
  const card = tokenAuction.nfts.map(c => c.name).join(', ');

  const link =
    tokenAuction.nfts.length === 1
      ? generateSportPath(LEGACY_CARD_SHOW, {
          params: {
            slug: tokenAuction.nfts[0].slug,
          },
          sport: tokenAuction.nfts[0].sport,
        })
      : generatePath(FOOTBALL_BUNDLED_AUCTION, {
          id: auction.id,
        });

  const content =
    tokenAuction.nfts.length === 1 ? (
      <TokenDescriptionFromProps
        displayName={tokenAuction.nfts[0].metadata.playerDisplayName}
        path={null}
        withoutLink
        description={
          <TokenMetas token={tokenAuction.nfts[0]} separator={<> &ndash; </>} />
        }
        Title={Text14}
        Details={Text14}
      />
    ) : (
      <BundledAuctionName bundledAuction={auction} Variant={Text16} />
    );

  const title = messages[name as keyof typeof messages];

  return (
    <DumbNotification
      title={
        title && <FormattedMessage {...title} values={{ b: Bold, card }} />
      }
      userAvatar={currentUser}
      tokenPicture={tokenAuction.nfts[0]}
      link={link}
      createdAt={createdAt}
      sport={sport}
      content={content}
      read={read}
      {...rest}
    />
  );
};

AuctionNotification.fragments = {
  auctionNotification: gql`
    fragment AuctionNotification_auctionNotification on AuctionNotification {
      ...Notification_notificationInterface
      tokenAuction {
        id
        nfts {
          slug
          assetId
          name
          sport
          ...DumbNotification_tokenPicture
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
            }
          }
          ...TokenDescription_tokenMetas
        }
      }
      auction {
        id
        slug
        ...BundledAuctionName_auction
      }
    }
    ${commonNotificationInterfaceFragment}
    ${DumbNotification.fragments.tokenPicture}
    ${TokenMetas.fragments.token}
    ${BundledAuctionName.fragments.auction}
  `,
};
