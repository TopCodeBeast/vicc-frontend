import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import UninteractiveBundledAuctionPreview from 'components/bundled/UninteractiveBundledAuctionPreview';
import UninteractiveToken from 'components/token/UninteractiveToken';
import Avatar from 'components/user/Avatar';
import SocialShare from 'components/user/SocialShare';
import UserName from 'components/user/UserName';
import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import { socialShareEventContext, socialShareEventName } from '@sorare/core/src/lib/events';
import { glossary } from '@sorare/core/src/lib/glossary';
import { isA } from '@sorare/core/src/lib/gql';

import { AuctionWonContent_tokenAuction } from './__generated__/index.graphql';

type Bidder = NonNullable<AuctionWonContent_tokenAuction['bestBid']>['bidder'];

type User = Bidder & { __typename: 'User' };

export interface Props {
  tokenAuction: AuctionWonContent_tokenAuction;
  isRendering?: boolean;
  onClick?: () => void;
}

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--unit);
`;

const Card = styled.div`
  width: 180px;
`;

const User = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const ClubBanner = styled.div`
  height: 100px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background-size: cover;
  background-position: center;
  &:after {
    content: '';
    background: linear-gradient(
      0deg,
      #0d0c11,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    position: absolute;
    inset: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  text-align: center;
`;

const SmallSorareLogo = styled(SorareLogo)`
  max-width: 60px;
`;

const CTAS = styled.div`
  display: flex;
  margin-top: var(--double-unit);
  gap: var(--unit);
`;

export const AuctionWonContent = ({
  tokenAuction,
  isRendering = false,
  onClick,
}: Props) => {
  const auctionWinner = tokenAuction.bestBid?.bidder;
  if (!auctionWinner || !isA<User>('User', auctionWinner)) return null;
  return (
    <>
      {auctionWinner.profile.clubBanner && (
        <ClubBanner
          style={{
            backgroundImage: `url(${auctionWinner.profile.clubBanner.pictureUrl})`,
          }}
        />
      )}
      <Cards>
        {tokenAuction.nfts.length > 1 ? (
          <UninteractiveBundledAuctionPreview
            bundledAuction={tokenAuction}
            size="xs"
          />
        ) : (
          tokenAuction.nfts.map(token => (
            <Card key={token.slug}>
              <UninteractiveToken token={token} width={160} />
            </Card>
          ))
        )}
      </Cards>
      <Footer>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="AuctionNotification.congrats"
            defaultMessage="Congratulations"
          />
        </Text16>
        <Title3>
          <FormattedMessage
            id="AuctionNotification.won"
            defaultMessage="Auction Won!"
          />
        </Title3>
        {auctionWinner && (
          <User>
            <Avatar user={auctionWinner} />
            <Text16 bold>
              <UserName user={auctionWinner} />
            </Text16>
          </User>
        )}
        {isRendering ? (
          <SmallSorareLogo variant="var(--c-neutral-500)" />
        ) : (
          <CTAS>
            <Button onClick={onClick} medium color="white">
              <FormattedMessage {...glossary.ok} />
            </Button>
            <SocialShare
              image={tokenAuction.socialPictureUrls}
              trackingEventName={socialShareEventName.SHARE_AUCTION_WON}
              trackingEventContext={socialShareEventContext.AUCTION_WON}
              renderButton={({ ShareButton, Icon, label }) => (
                <ShareButton medium color="blue" startIcon={Icon}>
                  {label}
                </ShareButton>
              )}
            />
          </CTAS>
        )}
      </Footer>
    </>
  );
};

AuctionWonContent.fragments = {
  tokenAuction: gql`
    fragment AuctionWonContent_tokenAuction on TokenAuction {
      id
      nfts {
        slug
        assetId
        collection
        ...UninteractiveToken_token
        ...Analytics_tokenInfo
      }
      bestBid {
        id
        bidder {
          ... on User {
            slug
            profile {
              id
              clubBanner {
                id
                pictureUrl
                color
              }
            }
            ...Avatar_publicUserInfoInterface
            ...UserName_publicUserInfoInterface
          }
        }
      }
      socialPictureUrls {
        post
        square
        story
      }
    }
    ${UninteractiveToken.fragments.token}
    ${analyticsFragments.tokenInfo}
    ${Avatar.fragments.publicUserInfoInterface}
    ${UserName.fragments.user}
  `,
};

export default AuctionWonContent;
