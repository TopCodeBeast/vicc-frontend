import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Caption } from '@sorare/core/src/atoms/typography';

import CurrentOwnerSection from '@sorare/marketplace/src/components/offer/CurrentOwner/CurrentOwnerSection';
import OwnerAccount from '@sorare/marketplace/src/components/offer/OwnerAccount';

import { CommonCardCurrentOwner_card } from './__generated__/index.graphql';

interface Props {
  card: CommonCardCurrentOwner_card;
}

export const CommonCardCurrentOwner = ({ card }: Props) => {
  if (!card?.owner?.account) return null;
  return (
    <CurrentOwnerSection>
      <OwnerAccount account={card.owner.account}>
        <Caption color="var(--c-neutral-600)">
          <FormattedMessage
            id="CommonCardCurrentOwner.owner"
            defaultMessage="Owner"
          />
        </Caption>
      </OwnerAccount>
    </CurrentOwnerSection>
  );
};

CommonCardCurrentOwner.fragments = {
  card: gql`
    fragment CommonCardCurrentOwner_card on Card {
      slug
      assetId
      owner {
        id
        transferType
        account {
          id
          ...OwnerAccount_account
        }
      }
    }
    ${OwnerAccount.fragments.account}
  ` as TypedDocumentNode<CommonCardCurrentOwner_card>,
};

export default CommonCardCurrentOwner;
