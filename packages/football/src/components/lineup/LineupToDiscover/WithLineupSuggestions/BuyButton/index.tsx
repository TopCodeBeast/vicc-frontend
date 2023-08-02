import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text14 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import {
  MonetaryAmountParams,
  monetaryAmountFragment,
} from '@sorare/core/src/lib/monetaryAmount';

import BuyField from '@sorare/marketplace/src/components/buyActions/BuyField';

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

const DisplayAmount = ({
  monetaryAmount,
}: {
  monetaryAmount: MonetaryAmountParams;
}) => {
  const { main } = useAmountWithConversion({
    monetaryAmount,
  });
  return <>{main}</>;
};

const BuyButton = ({ token, loading, onPaymentSuccess }: Props) => {
  const amounts = token?.liveSingleSaleOffer?.receiverSide.amounts;

  if (!amounts) {
    return null;
  }
  return (
    <Wrapper>
      <BuyField
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
              <DisplayAmount monetaryAmount={amounts} />
            </ButtonWrapper>
          </LoadingButton>
        )}
      />
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
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
      ...BuyField_token
    }
    ${monetaryAmountFragment}
    ${BuyField.fragments.token}
  ` as TypedDocumentNode<BuyButton_token>,
};

export default BuyButton;
