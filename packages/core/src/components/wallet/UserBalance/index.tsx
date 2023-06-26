import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { SupportedCurrency } from '__generated__/globalTypes';
import IconButton from '@core/atoms/buttons/IconButton';
import { Text14, Text16 } from '@core/atoms/typography';
import Dots from '@core/atoms/ui/Dots';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useAmountWithConversion, {
  Props as useAmountWithConversionProps,
} from '@core/hooks/useAmountWithConversion';
import useToggleHideBalance from '@core/hooks/useToggleHideBalance';

const Container = styled.div<{ $inline: boolean }>`
  display: flex;
  align-items: center;

  ${props =>
    props.$inline ? 'gap: var(--unit);' : `justify-content: space-between`};
`;

const Amount = styled.div`
  text-align: center;
  text-align: left;
`;

const Actions = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Icon = styled(IconButton)<{ $inline: boolean }>`
  width: var(--quadruple-unit);
  height: var(--quadruple-unit);
  min-width: auto;
  display: flex;
  margin-bottom: var(--double-unit);
  ${props => (props.$inline ? `margin-bottom: 0;` : '')}
`;

const Line = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--half-unit);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const MainXL = styled.span`
  font: var(--t-bold) var(--t-32);
`;

const Exponent = styled(Text14)`
  color: var(--c-neutral-600);
`;

const ExponentXL = styled(Text16)`
  color: var(--c-neutral-600);
`;

type UserBalanceAmountProps = useAmountWithConversionProps & {
  inline?: boolean;
  hideBalance?: boolean;
};

const UserBalanceAmount = ({
  inline,
  hideBalance,
  ...props
}: UserBalanceAmountProps) => {
  const { main, exponent } = useAmountWithConversion(props);

  if (inline)
    return (
      <Line>
        {main && (
          <Text14 color="var(--c-neutral-1000)">
            {hideBalance ? <Dots size="small" count={7} /> : main}
          </Text14>
        )}
        {exponent && (
          <Exponent>
            {hideBalance ? <Dots size="small" count={7} /> : `≈ ${exponent}`}
          </Exponent>
        )}
      </Line>
    );
  return (
    <Column>
      {main && (
        <MainXL>{hideBalance ? <Dots size="medium" count={7} /> : main}</MainXL>
      )}
      {exponent && (
        <ExponentXL>
          {hideBalance ? <Dots size="small" count={7} /> : `≈ ${exponent}`}
        </ExponentXL>
      )}
    </Column>
  );
};

type Props = {
  inline?: boolean;
  right?: ReactNode;
  disableToggle?: boolean;
};

export const UserBalance = ({
  inline,
  right,
  disableToggle = false,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { toggleHideBalance, loading } = useToggleHideBalance();

  if (!currentUser) return null;

  const { availableBalance } = currentUser;

  return (
    <Container $inline={!!inline}>
      <Amount>
        <UserBalanceAmount
          inline={!!inline}
          monetaryAmount={{
            referenceCurrency: SupportedCurrency.WEI,
            [SupportedCurrency.WEI.toLowerCase()]: availableBalance,
          }}
          hideBalance={
            disableToggle ? false : currentUser?.userSettings?.hideBalance
          }
        />
      </Amount>
      <Actions>
        {!disableToggle && (
          <Icon
            color="darkGray"
            small
            disableDebounce
            icon={currentUser?.userSettings?.hideBalance ? faEye : faEyeSlash}
            onClick={() => toggleHideBalance()}
            $inline={!!inline}
            disabled={loading}
          />
        )}
        {right}
      </Actions>
    </Container>
  );
};

export default UserBalance;
