import classNames from 'classnames';
import { useMemo } from 'react';
import styled from 'styled-components';

import { UserAccountEntryState } from '__generated__/globalTypes';
import {
  AmountWithConversion,
  Props as AmountWithConversionProps,
} from '@core/components/buyActions/AmountWithConversion';

const Modifier = styled.div`
  text-align: right;
  &.blue {
    color: var(--c-brand-600);
  }
  &.grey {
    color: var(--c-neutral-600);
  }
  &.cancelled {
    text-decoration: line-through;
  }
`;

type Props = AmountWithConversionProps & {
  aasmState: UserAccountEntryState;
  positive?: boolean;
};

export const TransactionAmountWithConversion = ({
  aasmState,
  positive,
  ...props
}: Props) => {
  const color = useMemo(() => {
    if (aasmState === UserAccountEntryState.CANCELLED) return 'grey';
    if (positive) return 'blue';
    return '';
  }, [aasmState, positive]);

  return (
    <Modifier className={classNames(color, aasmState.toLowerCase())}>
      <AmountWithConversion {...props} column />
    </Modifier>
  );
};
