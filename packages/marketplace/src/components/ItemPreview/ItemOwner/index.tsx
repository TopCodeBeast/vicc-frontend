import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Caption } from '@sorare/core/src/atoms/typography';

import { OwnerGalleryLink } from '@sorare/marketplace/src/components/TokenPreview/TokenOwner';

import { ItemOwner_user } from './__generated__/index.graphql';

const StyledCaption = styled(Caption)`
  display: flex;
  color: var(--c-neutral-600);
  gap: var(--half-unit);
  overflow: hidden;
`;

const Label = styled.span`
  white-space: nowrap;
`;

type Props = {
  variant?: 'auction' | 'sale';
  user?: ItemOwner_user | null;
  sport: Sport;
  withAvatar?: boolean;
  boughtFrom?: boolean;
};

export const ItemOwner = ({
  variant,
  user,
  sport,
  withAvatar = false,
  boughtFrom,
}: Props) => {
  if (!user) return null;

  if (variant === 'sale') {
    return (
      <StyledCaption color="var(--c-neutral-600)">
        <Label>
          {boughtFrom ? (
            <FormattedMessage
              id="PastSaleOfferItem.boughtFrom"
              defaultMessage="Bought from"
            />
          ) : (
            <FormattedMessage
              id="ItemSold.boughtBy"
              defaultMessage="Bought by"
            />
          )}
        </Label>
        <OwnerGalleryLink user={user} sport={sport} withAvatar={withAvatar} />
      </StyledCaption>
    );
  }
  if (variant === 'auction') {
    return (
      <StyledCaption color="var(--c-neutral-600)">
        <Label>
          <FormattedMessage id="ItemSold.wonBy" defaultMessage="Won by" />
        </Label>
        <OwnerGalleryLink user={user} sport={sport} withAvatar={withAvatar} />
      </StyledCaption>
    );
  }

  return <OwnerGalleryLink user={user} sport={sport} withAvatar={withAvatar} />;
};

ItemOwner.fragments = {
  user: gql`
    fragment ItemOwner_user on User {
      id
      slug
      ...OwnerGalleryLink_User
    }
    ${OwnerGalleryLink.fragments.user}
  `,
};
