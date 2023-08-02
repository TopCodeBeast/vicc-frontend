import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import Since from '@sorare/core/src/contexts/intl/Since';
import { isType } from '@sorare/core/src/lib/gql';

import { ItemOwner } from '@marketplace/components/ItemPreview/ItemOwner';

import { SaleWinner_offer } from './__generated__/index.graphql';

const StyledCaption = styled(Caption)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  sale: SaleWinner_offer;
};

export const SaleWinner = ({ sale }: Props) => {
  const { sender, actualReceiver } = sale;
  const { currentUser } = useCurrentUserContext();

  const isCurrentUserSender =
    isType(sender, 'User') && currentUser?.slug === sender.slug;
  const user = isCurrentUserSender ? actualReceiver : sender;
  if (!user || !isType(user, 'User')) return null;

  return (
    <StyledCaption as="div" color="var(--c-neutral-600)">
      <ItemOwner
        variant="sale"
        user={user}
        sport={sale.senderSide.nfts[0].sport}
        boughtFrom={!isCurrentUserSender}
      />
      ·
      <Since date={sale.endDate} />
    </StyledCaption>
  );
};

SaleWinner.fragments = {
  offer: gql`
    fragment SaleWinner_offer on TokenOffer {
      id
      endDate
      sender {
        ... on User {
          slug
          ...ItemOwner_user
        }
      }
      senderSide {
        id
        nfts {
          assetId
          slug
          sport
        }
      }
      actualReceiver {
        ... on User {
          slug
          ...ItemOwner_user
        }
      }
    }
    ${ItemOwner.fragments.user}
  ` as TypedDocumentNode<SaleWinner_offer>,
};
