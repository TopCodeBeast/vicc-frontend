import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';

import { ItemRequirements_clubShopItem } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
`;
const ItemRequirementsWrapper = styled.div`
  border-radius: var(--double-unit);
  border: 1px solid var(--c-neutral-400);
  display: flex;
  flex-direction: column;
`;
const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
  padding: var(--unit);
`;
const StyledImg = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

type Props = { item: ItemRequirements_clubShopItem };

export const ItemRequirements = ({ item }: Props) => {
  return (
    <Root>
      <Text16>
        <FormattedMessage
          id="ItemPreviewDialog.ItemRequirements.title"
          defaultMessage="To gain access to this item, you must purchase <b>{nb, plural, one {the following item} other {one of the following items}}</b>"
          values={{ b: Bold, nb: item.shopItemsRequired.length }}
        />
      </Text16>
      <ItemRequirementsWrapper>
        {item.shopItemsRequired.map(requiredItem => {
          return (
            <ItemWrapper key={requiredItem.id}>
              <Text16>{requiredItem.name}</Text16>
              <StyledImg alt="" src={requiredItem.pictureUrl} />
            </ItemWrapper>
          );
        })}
      </ItemRequirementsWrapper>
    </Root>
  );
};

ItemRequirements.fragments = {
  clubShopItem: gql`
    fragment ItemRequirements_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        shopItemsRequired {
          id
          name
          pictureUrl
        }
      }
    }
  ` as TypedDocumentNode<ItemRequirements_clubShopItem>,
};
