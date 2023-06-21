import { faWallet } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text18 } from '@core/atoms/typography';

const Wrapper = styled.div`
  background-color: var(--c-neutral-300);
  border: 1px var(--c-neutral-600) solid;
  width: 168px;
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--quadruple-unit);
  box-shadow: calc(-1 * var(--unit)) var(--unit) 0px 0px var(--c-neutral-300),
    calc(-1 * var(--unit)) var(--unit) 0px 1px var(--c-neutral-600);
`;

export const StaticCashBalance = () => {
  return (
    <Wrapper>
      <FontAwesomeIcon icon={faWallet} size="lg" color="var(--c-neutral-600)" />
      <div>
        <Text14 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="walletSetup.home.cashBalance"
            defaultMessage="Cash balance"
          />
        </Text14>
        <Text18 bold>$0.00</Text18>
      </div>
    </Wrapper>
  );
};
