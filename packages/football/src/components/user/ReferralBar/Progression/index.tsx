import classNames from 'classnames';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { range } from '@sorare/core/src/lib/arrays';

const ProgressBar = styled.div`
  display: flex;
  flex: 1;
  gap: 3px;

  & > span {
    height: 6px;
    background-color: var(--c-neutral-100);
    .dark-theme & {
      background-color: var(--c-neutral-700);
    }
    flex: 1;
    opacity: 0.3;
    &.active {
      opacity: 1;
    }
    &:first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    &:last-child {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
`;
const Progress = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: var(--unit);
`;

type Props = { count: number; max?: number; icon: ReactNode };

const Progression = ({ count, max = 5, icon }: Props) => {
  return (
    <Progress>
      {icon}
      <ProgressBar>
        {range(max).map((x, i) => {
          return <span key={x} className={classNames({ active: i < count })} />;
        })}
      </ProgressBar>
      <Text16 bold>
        <FormattedMessage
          id="ReferralBar.count"
          defaultMessage="{count} out of {max}"
          values={{ count: count < max ? count : max, max }}
        />
      </Text16>
    </Progress>
  );
};

export default Progression;
