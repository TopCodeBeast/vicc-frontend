import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import styled from 'styled-components';

import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import Avatar from '@sorare/core/src/components/user/Avatar';
import {
  GalleryLink,
  useCurrentSportGallery,
} from '@sorare/core/src/components/user/GalleryLink';
import UserName from '@sorare/core/src/components/user/UserName';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { isA } from '@sorare/core/src/lib/gql';

import { Bid_tokenBid } from './__generated__/index.graphql';

type Bid_tokenBid_bidder_User = Bid_tokenBid['bidder'] & {
  __typename: 'User';
};

type Props = {
  bid: Bid_tokenBid;
  displayAbsoluteDate: boolean;
};

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--c-neutral-300);
  padding: var(--intermediate-unit);

  &:first-of-type {
    border-top-left-radius: var(--double-unit);
    border-top-right-radius: var(--double-unit);
  }
  &:last-of-type {
    border-bottom-left-radius: var(--double-unit);
    border-bottom-right-radius: var(--double-unit);
  }
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
`;

const Bid = ({
  bid: { amounts, createdAt, bidder },
  displayAbsoluteDate,
}: Props) => {
  const { formatDate, formatDistanceToNow } = useIntlContext();
  const galleryLinkPath = useCurrentSportGallery();

  if (!bidder || !isA<Bid_tokenBid_bidder_User>('User', bidder)) return null;

  return (
    <Root>
      <Content>
        <Avatar user={bidder} />
        <div>
          <Text14>
            <GalleryLink user={bidder} galleryPathFactory={galleryLinkPath}>
              <UserName user={bidder} />
            </GalleryLink>
          </Text14>
          <Caption color="var(--c-neutral-600)">
            {displayAbsoluteDate
              ? formatDate(createdAt, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : formatDistanceToNow(parseISO(createdAt))}
          </Caption>
        </div>
      </Content>
      <AmountWithConversion monetaryAmount={amounts} />
    </Root>
  );
};

Bid.fragments = {
  tokenBid: gql`
    fragment Bid_tokenBid on TokenBid {
      id
      amounts {
        eur
        gbp
        usd
        wei
        referenceCurrency
      }
      createdAt
      bidder {
        ... on User {
          slug
          ...Avatar_publicUserInfoInterface
          ...UserName_publicUserInfoInterface
          ...GalleryLink_publicUserInfoInterface
        }
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${UserName.fragments.user}
    ${GalleryLink.fragments.user}
  `,
};

export default Bid;
