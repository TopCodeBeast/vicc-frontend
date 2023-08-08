import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState } from 'react';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Dropdown from '@core/atoms/dropdowns/Dropdown';
import { Radio } from '@core/atoms/inputs/Radio';
import { Text16 } from '@core/atoms/typography';

const StyledButton = styled(Button).attrs({
  color: 'transparent',
  small: true,
})`
  margin: 0 calc(-1 * var(--double-unit));
`;

const Caret = styled(FontAwesomeIcon).attrs({ icon: faAngleDown })`
  margin-left: var(--unit);
  transition: transform 0.25s ease-out;
  transform: none;
  &.expanded {
    transform: rotate(-180deg);
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
  overflow: hidden;
  user-select: none;
  > * {
    padding: var(--unit) var(--double-unit);
    transition: background-color 0.1s ease-in;
    &:hover,
    &:focus-within {
      background-color: rgba(var(--c-rgb-neutral-1000), 0.05);
    }
  }
`;

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export const SeasonDropdown = ({ options, value, onChange }: Props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Dropdown
      darkTheme
      label={
        <StyledButton>
          <Text16 bold>{value}</Text16>
          <Caret className={classNames({ expanded })} />
        </StyledButton>
      }
      onOpen={() => setExpanded(true)}
      onClose={() => setExpanded(false)}
    >
      {({ closeDropdown }) => (
        <Options>
          {options.map(option => (
            <Radio
              key={option}
              name={option}
              checked={value === option}
              value={value}
              onChange={() => {
                onChange(option);
                closeDropdown();
              }}
              labelContent={<Text16 bold>{option}</Text16>}
            />
          ))}
        </Options>
      )}
    </Dropdown>
  );
};
