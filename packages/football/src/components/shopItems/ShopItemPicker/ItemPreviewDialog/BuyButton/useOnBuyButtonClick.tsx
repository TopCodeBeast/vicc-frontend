import { useState } from 'react';

import useBuyShopItem from './useBuyShopItem';

export const useOnBuyButtonClick = (
  nextStep: () => void,
  onBuy?: () => void
) => {
  const [loading, setLoading] = useState(false);
  const buyShopItem = useBuyShopItem();

  const onBuyButtonClick = (shopItemId: string) => {
    setLoading(true);
    buyShopItem(shopItemId).then(errors => {
      if (!errors?.length) {
        if (onBuy) {
          onBuy();
        } else {
          nextStep();
        }
      }
      setLoading(false);
    });
  };

  return { onBuyButtonClick, loading };
};
