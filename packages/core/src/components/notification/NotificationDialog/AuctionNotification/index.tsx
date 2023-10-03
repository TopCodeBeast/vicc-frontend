import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';
import styled from 'styled-components';

import Layout from '../Layout';
import AuctionNotificationContent from './Content';
import { NotificationDialog_AuctionNotification_auctionNotification } from './__generated__/index.graphql';

export interface Props {
  notification: NotificationDialog_AuctionNotification_auctionNotification;
  onClose: (markAllAsRead?: boolean) => void;
}

const StyledLayout = styled(Layout)`
  background: linear-gradient(
    180deg,
    var(--c-static-neutral-1000) 0%,
    var(--c-static-neutral-900) 100%
  );
  color: var(--c-static-neutral-100);
  border: none;
`;

export const AuctionNotification = ({ notification, onClose }: Props) => {
  const { name, auction } = notification;

  const onClick = useCallback(() => {
    onClose();
    setTimeout(() => {
      onClose();
    }, 400);
  }, [onClose]);

  if (name !== 'card_bought') return null;

  return (
    <StyledLayout onClose={onClose}>
      <AuctionNotificationContent
        onClick={onClick}
        tokenAuction={auction}
      />
    </StyledLayout>
  );
};

AuctionNotification.fragments = {
  notification: gql`
    fragment NotificationDialog_AuctionNotification_auctionNotification on AuctionNotification {
      id
      name
      auction {
        id
        ...AuctionWonContent_tokenAuction
      }
    }
    ${AuctionNotificationContent.fragments.tokenAuction}
  ` as TypedDocumentNode<NotificationDialog_AuctionNotification_auctionNotification>,
};

export default AuctionNotification;
