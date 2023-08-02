import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { glossary } from '@sorare/core/src/lib/glossary';

import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';

import { LogoContent_clubShopItem } from './__generated__/index.graphql';

const CenteredButton = styled(Button)`
  align-self: center;
`;

type Props = { item: LogoContent_clubShopItem; onSelect?: () => void };

export const LogoContent = ({ item, onSelect }: Props) => {
  return (
    <>
      <ItemImagePreview
        pictureUrl={item.pictureUrl}
        name={item.name}
        type={item.position}
      />
      <Details item={item} />
      <CenteredButton color="blue" medium onClick={onSelect}>
        <FormattedMessage {...glossary.select} />
      </CenteredButton>
    </>
  );
};

LogoContent.fragments = {
  clubShopItem: gql`
    fragment LogoContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        pictureUrl
        name
        position
      }
      ...Details_shopItem
    }
    ${Details.fragments.shopItem}
  ` as TypedDocumentNode<LogoContent_clubShopItem>,
};
