import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';
import CoinAmount from '@sorare/core/src/components/clubShop/CoinAmount';
import PostalAdressFormDumb from '@sorare/core/src/components/settings/PostalAddressForm';

import { PostalAdressForm_shopItem } from './__generated__/index.graphql';
import useBuyDeliverableShopItem from './useBuyDeliverableShopItem';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const ItemImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;
const ItemDetails = styled.div`
  width: 100%;
  padding: var(--unit);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--intermediate-unit);
`;
const ButtonWrapper = styled.div`
  display: inline-flex;
  margin: auto;
`;

type Props = {
  item: PostalAdressForm_shopItem;
  selectedSize?: ShirtSize;
  nextStep: () => void;
};
const PostalAdressForm = ({ item, selectedSize, nextStep }: Props) => {
  const [validFormValues, setValidFormValues] = useState(false);
  const buyDeliverableShopItem = useBuyDeliverableShopItem();
  const realPrice = item.salePrice ?? item.price;

  return (
    <Root>
      <ItemDetails>
        <FlexContainer>
          <ItemImage src={item.pictureUrl} alt={item.name} />
          {item.name} {selectedSize && `- ${selectedSize}`}
        </FlexContainer>
        <CoinAmount amount={realPrice} />
      </ItemDetails>
      <PostalAdressFormDumb
        onSubmit={(attributes, onResult) => {
          buyDeliverableShopItem({
            shopItemId: item.id,
            shirtSize: selectedSize,
            postalAddress: {
              ...attributes,
            },
          }).then(onResult);
        }}
        onSuccess={nextStep}
        onChange={({
          countryCode,
          firstName,
          lastName,
          streetAddress,
          zipcode,
          city,
        }) =>
          setValidFormValues(
            !!(
              countryCode &&
              firstName &&
              lastName &&
              streetAddress &&
              zipcode &&
              city
            )
          )
        }
        button={SubmitButton => (
          <ButtonWrapper>
            <SubmitButton disabled={!validFormValues} color="blue" medium>
              <FormattedMessage
                id="ItemPreviewDialog.PostalAddressForm.Cta.confirm"
                defaultMessage="Confirm your purchase"
              />
            </SubmitButton>
          </ButtonWrapper>
        )}
      />
    </Root>
  );
};

PostalAdressForm.fragments = {
  shopItem: gql`
    fragment PostalAdressForm_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        price
        salePrice
        pictureUrl
      }
    }
  ` as TypedDocumentNode<PostalAdressForm_shopItem>,
};

export default PostalAdressForm;
