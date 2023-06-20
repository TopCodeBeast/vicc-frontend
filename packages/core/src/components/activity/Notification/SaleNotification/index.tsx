import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import TokenDescriptionFromProps from 'components/token/TokenDescriptionFromProps';
import TokenMetas from 'components/token/TokenMetas';
import { LEGACY_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSportContext } from '@sorare/core/src/contexts/sport';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { SaleNotification_saleNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: SaleNotification_saleNotification;
};

const messages = defineMessages({
  card_sold: {
    id: 'Activity.Notifications.cardSold',
    defaultMessage: 'You sold <b>{card}</b>',
  },
  card_not_sold: {
    id: 'Activity.Notifications.cardNotSold',
    defaultMessage: 'Your sale for <b>{card}</b> has ended',
  },
});

export const SaleNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { generateSportPath } = useSportContext();

  const { name, createdAt, token, sport, read } = notification;

  const link = generateSportPath(LEGACY_CARD_SHOW, {
    params: {
      slug: token.slug,
    },
    sport: token.sport,
  });

  const content = (
    <TokenDescriptionFromProps
      displayName={token.metadata.playerDisplayName}
      path={null}
      withoutLink
      description={<TokenMetas token={token} separator={<> &ndash; </>} />}
      Title={Text14}
      Details={Text14}
    />
  );

  return (
    <DumbNotification
      title={
        <FormattedMessage
          {...messages[name as keyof typeof messages]}
          values={{ b: Bold, card: token.name }}
        />
      }
      userAvatar={currentUser}
      sport={sport}
      tokenPicture={token}
      content={content}
      createdAt={createdAt}
      link={link}
      read={read}
      {...rest}
    />
  );
};

SaleNotification.fragments = {
  saleNotification: gql`
    fragment SaleNotification_saleNotification on SaleNotification {
      ...Notification_notificationInterface
      sport
      token {
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
    ${commonNotificationInterfaceFragment}
    ${DumbNotification.fragments.tokenPicture}
    ${TokenMetas.fragments.token}
  `,
};
