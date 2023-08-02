import classNames from 'classnames';
import styled from 'styled-components';

import { Currency, SupportedCurrency } from '__generated__/globalTypes';
import { Text14, Title2 } from '@core/atoms/typography';
import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useAmountWithConversion from '@core/hooks/useAmountWithConversion';
import { MonetaryAmountParams } from '@core/lib/monetaryAmount';

const Root = styled.div`
  aspect-ratio: var(--card-aspect-ratio);
  width: 235px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const Image = styled.img`
  aspect-ratio: var(--card-aspect-ratio);
  width: 100%;

  position: absolute;
  top: 0;
`;

const StyledTitle2 = styled(Title2)`
  position: absolute;
  bottom: 100px;
  z-index: 1;
`;

const StyledText14 = styled(Text14)`
  position: absolute;
  bottom: var(--triple-unit);
  z-index: 1;
`;

type Props = {
  monetaryAmount: MonetaryAmountParams;
};

export const FrontMonetaryReward = ({ monetaryAmount }: Props) => {
  const { fiatCurrency } = useCurrentUserContext();

  const currency =
    monetaryAmount.referenceCurrency === SupportedCurrency.WEI
      ? Currency.ETH
      : Currency.FIAT;

  const imageUrl = {
    [Currency.ETH]: `${FRONTEND_ASSET_HOST}/cards/front/ethereum.png`,
    [Currency.FIAT]: `${FRONTEND_ASSET_HOST}/cards/front/${fiatCurrency.code.toLowerCase()}.png`,
  }[currency];

  const { main, exponent } = useAmountWithConversion({
    monetaryAmount,
    primaryCurrency:
      monetaryAmount.referenceCurrency === SupportedCurrency.WEI
        ? Currency.ETH
        : Currency.FIAT,
  });

  return (
    <Root
      className={classNames({
        eth: currency === Currency.ETH,
      })}
    >
      <Image src={imageUrl} alt="" />
      <StyledTitle2 color="var(--c-static-neutral-100)">{main}</StyledTitle2>
      {currency === Currency.ETH && (
        <StyledText14 bold color="var(--c-static-neutral-100)">
          {exponent}
        </StyledText14>
      )}
    </Root>
  );
};
