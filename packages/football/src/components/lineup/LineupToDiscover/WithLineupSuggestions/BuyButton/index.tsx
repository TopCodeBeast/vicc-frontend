import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text14 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';

// import BuyField from '@sorare/marketplace/src/components/buyActions/BuyField';

import { BuyButton_token } from './__generated__/index.graphql';

const Wrapper = styled.div`
  width: 100%;
  z-index: 2;
`;
const ButtonWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--half-unit);
`;
type Props = {
  token: BuyButton_token | null;
  onPaymentSuccess: () => void;
  loading: boolean;
};

const BuyButton = ({ token, loading, onPaymentSuccess }: Props) => {
  const priceWei = token?.liveSingleSaleOffer?.priceWei;
  const { main } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      [SupportedCurrency.WEI.toLowerCase()]: priceWei,
    },
  });
  if (!priceWei) {
    return null;
  }
  return (
    <Wrapper>
      <>BuyField53</>
      {/* <BuyField
        onSuccess={onPaymentSuccess}
        token={token}
        renderButton={buttonProps => (
          <LoadingButton
            color="blue"
            small
            fullWidth
            {...buttonProps}
            loading={loading || !!buttonProps.loading}
          >
            <ButtonWrapper>
              <Text14 bold>
                <FormattedMessage
                  id="BuyButton.buyFor"
                  defaultMessage="Buy this card for"
                />
              </Text14>
              {main}
            </ButtonWrapper>
          </LoadingButton>
        )}
      /> */}
    </Wrapper>
  );
};

BuyButton.fragments = {
  token: gql`
    fragment BuyButton_token on Token {
      assetId
      slug
      liveSingleSaleOffer {
        id
        priceWei: price
      }
      #...BuyField_token
    }
    #{BuyField.fragments.token}
  `,
};

export default BuyButton;
