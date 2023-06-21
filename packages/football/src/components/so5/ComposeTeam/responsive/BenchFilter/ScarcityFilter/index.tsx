import classNames from 'classnames';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16, text14 } from '@sorare/core/src/atoms/typography';
import ScarcityBall from '@sorare/core/src/components/card/ScarcityBall';
import { Scarcity } from '@sorare/core/src/lib/cards';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--unit);
`;

const Option = styled.label`
  white-space: nowrap;
  padding: var(--half-unit) var(--intermediate-unit);
  background: var(--c-neutral-200);
  border-radius: ${theme.shape.borderRadius}px;
  ${text14}
  color: var(--c-neutral-600);
  &.selected {
    background: var(--c-neutral-400);
    color: var(--c-neutral-1000);
  }
  cursor: pointer;
`;

type Props = {
  onChange: (selected: Scarcity[]) => void;
  selectedValues: Scarcity[];
  scarcitiesOptions: readonly Scarcity[];
};

export const ScarcityFilter = ({
  onChange,
  selectedValues,
  scarcitiesOptions,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Wrapper>
      <Text16>
        {formatMessage(fantasy.scarcities)} ({selectedValues.length})
      </Text16>
      <OptionsWrapper>
        {scarcitiesOptions.map(scarcity => (
          <Option
            key={scarcity}
            htmlFor={scarcity}
            className={classNames({
              selected: selectedValues.includes(scarcity),
            })}
          >
            <ScarcityBall scarcity={scarcity} />
            <input
              className="sr-only"
              type="checkbox"
              checked={selectedValues.some(value => value === scarcity)}
              id={scarcity}
              value={scarcity}
              onChange={e => {
                const { checked, value: currentValue } = e.target;
                const newValues = checked
                  ? [...selectedValues, currentValue as Scarcity]
                  : selectedValues.filter(value => value !== currentValue);

                onChange(newValues);
              }}
            />
          </Option>
        ))}
      </OptionsWrapper>
    </Wrapper>
  );
};

export default ScarcityFilter;
