import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption, Title3 } from '@sorare/core/src/atoms/typography';
import Dots from '@sorare/core/src/atoms/ui/Dots';
import { useCurrentUserContext } from 'contexts/currentUser';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--triple-unit);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-200);
  .dark-theme & {
    background-color: var(--c-neutral-400);
  }
`;

export const EthBalance = ({ ethFirst = false, hideExponent = false }) => {
  const { currentUser } = useCurrentUserContext();
  const { main, exponent } = useAmountWithConversion({
    context: 'EthBalance',
    amount: currentUser?.availableBalance || '0',
    unit: 'wei',
    ethFirst,
  });
  const hideBalance = currentUser?.userSettings?.hideBalance;
  return (
    <Container>
      <FontAwesomeIcon
        size="lg"
        icon={faEthereum}
        color="var(--c-neutral-1000)"
      />
      <div>
        <FormattedMessage id="EthBalance.title" defaultMessage="ETH balance" />
        <Title3 as="p">
          {hideBalance ? <Dots count={7} size="medium" /> : main}
        </Title3>
        {!hideExponent && (
          <Caption bold>
            {hideBalance ? (
              <Dots count={7} size="small" />
            ) : (
              <>&#8776; {exponent}</>
            )}
          </Caption>
        )}
      </div>
    </Container>
  );
};

export default EthBalance;
