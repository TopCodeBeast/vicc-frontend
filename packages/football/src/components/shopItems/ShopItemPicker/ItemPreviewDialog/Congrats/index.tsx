import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import Details from '@sorare/football/src/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@sorare/football/src/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';

import { Congrats_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: var(--triple-unit);
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  text-align: center;
`;

type Props = {
  item: Congrats_shopItem;
  inventory?: boolean;
  onClose: () => void;
};
const Congrats = ({ item, inventory, onClose }: Props) => {
  const { currentUser } = useCurrentUserContext();
  return (
    <Root>
      <FlexColContainer>
        <ItemImagePreview
          pictureUrl={item.pictureUrl}
          name={item.name}
          type={item.position}
        />
        <Details item={item} orderConfirmed />
      </FlexColContainer>
      <FlexColContainer>
        <Text14 color="var(--c-neutral-600)">
          {inventory ? (
            <FormattedMessage
              id="ItemPreviewDialog.Congrats.inventory"
              defaultMessage="Your order was confirmed. You should receive your item in a few weeks."
            />
          ) : (
            <FlexColContainer>
              <Text14>
                <FormattedMessage
                  id="ItemPreviewDialog.Congrats.shop"
                  defaultMessage="We will send you an email confirmation to {email} shortly."
                  values={{ email: currentUser?.email }}
                />
              </Text14>
              <Text14>
                <FormattedMessage
                  id="ItemPreviewDialog.Congrats.panopli"
                  defaultMessage="Tracking updates will be provided via email by our dispatch partner, Panopli."
                />
              </Text14>
            </FlexColContainer>
          )}
        </Text14>
        <Button onClick={onClose} color="blue" medium>
          <FormattedMessage
            id="ItemPreviewDialog.Congrats.Cta.BackToClubShop"
            defaultMessage="Return to Club Shop"
          />
        </Button>
      </FlexColContainer>
    </Root>
  );
};

Congrats.fragments = {
  shopItem: gql`
    fragment Congrats_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        description
        position
        pictureUrl
        price
        salePrice
        myPurchasesCount
      }
    }
  `,
};

export default Congrats;
