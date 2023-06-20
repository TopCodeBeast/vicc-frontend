import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';
import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import { Text14 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isA, isType } from '@sorare/core/src/lib/gql';

import CoinAmount from '@sorare/football/src/components/user/CoinAmount';

import Congrats from './Congrats';
import Details from './Details';
import ItemImagePreview from './ItemImagePreview';
import PostalAdressForm from './PostalAdressForm';
import SizeSelector from './SizeSelector';
import Step1 from './Step1';
import Step2 from './Step2';
import { ItemPreviewDialog_shopItem } from './__generated__/index.graphql';

const DialogContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  padding: var(--triple-unit);
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
const CloseButtonWrapper = styled.div`
  align-self: flex-end;
`;
const MyBalance = styled.div`
  justify-self: flex-end;
  display: flex;
  justify-content: space-between;
  padding: var(--double-unit);
  border-top: 1px solid var(--c-neutral-300);
`;

type Props = {
  open: boolean;
  onSelect?: () => void;
  item: ItemPreviewDialog_shopItem;
  itemEquipped?: boolean;
  inventory?: boolean;
  onClose: () => void;
  onBuy?: () => void;
};
const ItemPreviewDialog = ({
  open,
  onSelect,
  item,
  itemEquipped,
  inventory,
  onClose,
  onBuy,
}: Props) => {
  const [prevOpen, setPrevOpen] = useState(open);
  const [selectedSize, setSelectedSize] = useState<ShirtSize | null>(null);
  const skipBuyStep =
    inventory || (isA('SkinShopItem', item) && item.myPurchasesCount > 0);

  const [step, setStep] = useState(skipBuyStep ? 1 : 0);
  const { currentUser } = useCurrentUserContext();
  const userCoinBalance = currentUser?.coinBalance || 0;

  // Open preview dialog
  if (prevOpen !== open) {
    if (open) {
      const finalStep = isType(item, 'JerseyShopItem') ? 2 : 1;
      setStep(skipBuyStep ? finalStep : 0);
    }
    setPrevOpen(open);
  }

  const nextStep = () => setStep(s => s + 1);
  let steps = [];
  if (isType(item, 'JerseyShopItem')) {
    steps = [
      {
        displayPreview: true,
        content: (
          <SizeSelector
            key="size-step"
            item={item}
            userCoinBalance={userCoinBalance}
            selectedSize={selectedSize}
            onChange={setSelectedSize}
            nextStep={nextStep}
          />
        ),
      },
      {
        displayPreview: false,
        content: (
          <PostalAdressForm
            key="address-step"
            selectedSize={selectedSize!}
            item={item}
            nextStep={nextStep}
          />
        ),
      },
      {
        displayPreview: false,
        content: (
          <Congrats
            key="congrats-step"
            item={item}
            inventory={inventory}
            onClose={onClose}
          />
        ),
      },
    ];
  } else {
    steps = [
      {
        displayPreview: true,
        content: (
          <Step1
            key="buy-step"
            item={item}
            userCoinBalance={userCoinBalance}
            nextStep={nextStep}
            onBuy={onBuy}
          />
        ),
      },
      {
        displayPreview: true,
        content: (
          <Step2
            key="use-step"
            onSelect={onSelect}
            item={item}
            inventory={inventory}
            onClose={onClose}
          />
        ),
      },
    ];
  }

  const currentStep = steps[step];

  return (
    <Dialog maxWidth="xs" fullWidth onClose={onClose} darkTheme open={open}>
      <FlexColContainer>
        <DialogContainer>
          <CloseButtonWrapper>
            <CloseButton onClose={onClose} />
          </CloseButtonWrapper>

          {currentStep.displayPreview && (
            <>
              <ItemImagePreview
                pictureUrl={item.pictureUrl}
                name={item.name}
                type={item.position}
              />
              <Details item={item} itemEquipped={itemEquipped} />
            </>
          )}

          {!itemEquipped && currentStep.content}
        </DialogContainer>
        <MyBalance>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.ItemPreviewDialog.CurrentBalance"
              defaultMessage="Current balance"
            />
          </Text14>
          <CoinAmount amount={userCoinBalance} />
        </MyBalance>
      </FlexColContainer>
    </Dialog>
  );
};

ItemPreviewDialog.fragments = {
  shopItem: gql`
    fragment ItemPreviewDialog_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        position
        pictureUrl
      }
      ...Details_shopItem
      ...Step1_shopItem
      ...Step2_shopItem
      ...SizeSelector_shopItem
      ...PostalAdressForm_shopItem
    }
    ${Details.fragments.shopItem}
    ${Step1.fragments.shopItem}
    ${Step2.fragments.shopItem}
    ${SizeSelector.fragments.shopItem}
    ${PostalAdressForm.fragments.shopItem}
  `,
  user: gql`
    fragment ItemPreviewDialog_user on PublicUserInfoInterface {
      slug
      profile {
        id
        clubBanner {
          id
        }
        clubShield {
          id
        }
      }
    }
  `,
};

export default ItemPreviewDialog;
