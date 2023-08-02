import { defineMessages, useIntl } from 'react-intl';

import { Currency } from '__generated__/globalTypes';
import CardBack from '@core/components/card/Back/Football';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { useCurrentUserContext } from '@core/contexts/currentUser';

type Props = {
  currency: Currency;
};

const messages = defineMessages({
  ethReward: {
    id: 'Rewards.MonetaryReward.BackMonetaryReward.ethReward',
    defaultMessage: 'Eth reward',
  },
  fiatReward: {
    id: 'Rewards.MonetaryReward.BackMonetaryReward.fiatReward',
    defaultMessage: 'Fiat reward',
  },
});

export const BackMonetaryReward = ({ currency }: Props) => {
  const { fiatCurrency } = useCurrentUserContext();
  const { formatMessage } = useIntl();

  const imageUrl = {
    [Currency.ETH]: `${FRONTEND_ASSET_HOST}/cards/back/ethereum.png`,
    [Currency.FIAT]: `${FRONTEND_ASSET_HOST}/cards/back/${fiatCurrency.code.toLowerCase()}.png`,
  }[currency];

  const ariaLabel = {
    [Currency.ETH]: messages.ethReward,
    [Currency.FIAT]: messages.fiatReward,
  }[currency];

  return (
    <CardBack
      aria-label={formatMessage(ariaLabel)}
      path={imageUrl}
      radius="10px"
    />
  );
};
