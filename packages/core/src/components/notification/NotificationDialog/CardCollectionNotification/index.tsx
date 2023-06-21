import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Text14, Title2 } from '@core/atoms/typography';
import UninteractiveToken from '@core/components/token/UninteractiveToken';
import { FOOTBALL_USER_CARD_COLLECTION } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import Layout from '../Layout';
import { NotificationDialog_CardCollectionNotification_cardCollectionNotification } from './__generated__/index.graphql';

interface Props {
  notification: NotificationDialog_CardCollectionNotification_cardCollectionNotification;
  onClose: (markAllAsRead?: boolean) => void;
}

const messages = defineMessages({
  cta: {
    id: 'CardCollectionNotification.cta',
    defaultMessage: 'Check it out!',
  },
});

const CardWrapper = styled.div`
  width: 180px;
  margin: var(--unit) auto;
`;

export const CardCollectionNotification = ({
  notification,
  onClose,
}: Props) => {
  const navigate = useNavigate();
  const { cardCollection, card, name } = notification;
  const { currentUser } = useCurrentUserContext();

  if (name !== 'card_attached') return null;
  if (!card?.token) return null;

  const onClick = () =>
    navigate(
      generatePath(FOOTBALL_USER_CARD_COLLECTION, {
        slug: currentUser?.slug,
        collectionSlug: cardCollection.slug,
      })
    );

  return (
    <Layout onClose={onClose} onClick={onClick} cta={messages.cta}>
      <CardWrapper>
        <UninteractiveToken token={card.token} width={160} />
      </CardWrapper>
      <Title2>
        <FormattedMessage
          id="CardCollectionNotification.title"
          defaultMessage="Card added to Collection!"
        />
      </Title2>
      <Text14>
        <FormattedMessage
          id="CardCollectionNotification.context"
          defaultMessage="A new Card has been added to your {name} Collection."
          values={{ name: cardCollection.name }}
        />
      </Text14>
    </Layout>
  );
};

CardCollectionNotification.fragments = {
  notification: gql`
    fragment NotificationDialog_CardCollectionNotification_cardCollectionNotification on CardCollectionNotification {
      id
      name
      cardCollection {
        slug
        name
      }
      card {
        assetId
        slug
        pictureUrl
        token {
          assetId
          slug
          ...UninteractiveToken_token
        }
      }
    }
    ${UninteractiveToken.fragments.token}
  `,
};

export default CardCollectionNotification;
