import Big from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  MarketplacePromotionalEvent,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { glossary } from '@sorare/core/src/lib/glossary';

import { ItemSpecialRewardBadge } from '@marketplace/components/ItemPreview/ItemSpecialRewardBadge';
import AuctionTimeLeft from '@marketplace/components/auction/AuctionTimeLeft';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const Line = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--unit);
`;
const Exponent = styled(Text16)`
  color: var(--c-neutral-600);
`;

type Props = {
  price: WeiAmount;
  endDate: string;
  cancelled: boolean;
  privatePrice?: WeiAmount;
  promotionalEvent?: MarketplacePromotionalEvent;
};

export const SingleSaleOfferDetails = ({
  price,
  privatePrice,
  endDate,
  cancelled,
  promotionalEvent,
}: Props) => {
  const amount =
    privatePrice && new Big(privatePrice).gt(price) ? privatePrice : price;
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      [SupportedCurrency.WEI.toLowerCase()]: amount,
    },
  });
  return (
    <Column>
      <Line>
        {main && <Title3>{main}</Title3>}
        {exponent && <Exponent>{exponent}</Exponent>}
      </Line>
      {promotionalEvent && <ItemSpecialRewardBadge event={promotionalEvent} />}
      {cancelled ? (
        <FormattedMessage {...glossary.canceled} />
      ) : (
        <AuctionTimeLeft endDate={endDate} />
      )}
    </Column>
  );
};
