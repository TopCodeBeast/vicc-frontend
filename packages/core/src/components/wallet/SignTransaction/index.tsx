import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const SignTransaction = () => {
  return (
    <Root>
      <FormattedMessage
        id="SignTransaction"
        defaultMessage="Please sign the transaction with your wallet."
      />
    </Root>
  );
};

export default SignTransaction;
