import { gql } from '@apollo/client';
import classnames from 'classnames';
import { parseISO } from 'date-fns';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { isType } from '@sorare/core/src/lib/gql';

import { ResetIn } from '@football/components/shopItems/ShopItemPicker/Item/Label';

import { SizeSelector_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
`;
const SizeSelectorWrapper = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: center;
  margin-bottom: var(--double-unit);
  &.disabled {
    opacity: 0.8;
    pointer-events: none;
  }
`;
const Selector = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--unit) var(--double-unit);
  border-radius: var(--unit);
  background-color: var(--c-neutral-300);
  width: 50px;
  &.active {
    background-color: var(--c-neutral-400);
  }
`;

const ctaMessages = defineMessages({
  soldOut: {
    id: 'ItemPreviewDialog.SizeSelector.Cta.soldOut',
    defaultMessage: 'Sold out',
  },
  buy: {
    id: 'ItemPreviewDialog.SizeSelector.Cta.buy',
    defaultMessage: 'Buy this item',
  },
});

type Props = {
  item: SizeSelector_shopItem;
  userCoinBalance: number;
  selectedSize: ShirtSize | null;
  onChange?: React.Dispatch<React.SetStateAction<ShirtSize | null>>;
  nextStep: () => void;
};
const SizeSelector = ({
  userCoinBalance,
  item,
  selectedSize,
  onChange,
  nextStep,
}: Props) => {
  const hasCooldown = item.myLimitResetAt !== null;
  const realPrice = item.salePrice ?? item.price;
  const limitReached = item.myPurchasesCount === item.limitPerUser;
  const soldOut =
    isType(item, 'JerseyShopItem') && item.currentStockCount === 0;
  const cantBuy =
    realPrice > userCoinBalance || limitReached || hasCooldown || soldOut;
  const buyButtonDisabled = cantBuy || !selectedSize;

  return (
    <Root>
      <SizeSelectorWrapper className={classnames({ disabled: cantBuy })}>
        {[
          ShirtSize.XS,
          ShirtSize.S,
          ShirtSize.M,
          ShirtSize.L,
          ShirtSize.XL,
          ShirtSize.XXL,
        ].map(size => (
          <Selector
            key={size}
            onClick={() => onChange?.(size)}
            className={classnames({ active: selectedSize === size })}
          >
            {size}
          </Selector>
        ))}
      </SizeSelectorWrapper>
      {hasCooldown && <ResetIn time={parseISO(item.myLimitResetAt!)} />}
      <Button
        color="blue"
        onClick={nextStep}
        disabled={buyButtonDisabled}
        medium
      >
        <FormattedMessage
          {...(soldOut && !hasCooldown ? ctaMessages.soldOut : ctaMessages.buy)}
        />
      </Button>
    </Root>
  );
};

SizeSelector.fragments = {
  shopItem: gql`
    fragment SizeSelector_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        price
        salePrice
        myPurchasesCount
        limitPerUser
        myLimitResetAt
      }
      ... on JerseyShopItem {
        id
        currentStockCount
      }
    }
  `,
};

export default SizeSelector;
