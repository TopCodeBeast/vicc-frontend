import { faAngleDown, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactElement, ReactNode, useState } from 'react';
import styled, { css } from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Dropdown from '@core/atoms/dropdowns/Dropdown';

const ButtonsWrapper = styled.div<{ fullWidth: boolean }>`
  position: relative;
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

const StyledIcon = styled(FontAwesomeIcon)<{ $isMenuOpen: boolean }>`
  opacity: 0.5;
  margin-left: var(--unit);
  transition: transform 0.25s ease-out;
  transform: none;
  ${({ $isMenuOpen }) =>
    $isMenuOpen &&
    css`
      transform: rotate(-180deg);
    `};
`;

const MainButton = styled(Button)`
  display: flex;
  justify-content: space-between;
`;

const LabelWrapper = styled.span<{ filterSelected: boolean }>`
  overflow: hidden;
  ${({ filterSelected }) =>
    filterSelected &&
    css`
      margin-right: calc(3 * var(--unit));
    `};
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
`;

const CloseContent = styled.span`
  color: var(--c-neutral-1000);
`;

type Props = {
  buttonLabel: ReactNode;
  buttonSize?: 'small' | 'medium';
  children: ReactElement | FC<{ closeDropdown: () => void }>;
  fullWidth?: boolean;
  filterSelected?: boolean;
  onClearFilter?: () => void;
  darkTheme?: boolean;
};

export const FilterInDropdown = ({
  buttonLabel,
  buttonSize = 'small',
  fullWidth = false,
  filterSelected = false,
  onClearFilter = () => {},
  children,
  darkTheme,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Dropdown
      fullWidth={fullWidth}
      align="right"
      darkTheme={darkTheme}
      label={
        <ButtonsWrapper fullWidth={fullWidth}>
          <MainButton
            color="white"
            small={buttonSize === 'small'}
            medium={buttonSize === 'medium'}
            fullWidth={fullWidth}
            disableDebounce
            disableElevation
          >
            <LabelWrapper filterSelected={filterSelected}>
              {buttonLabel}
            </LabelWrapper>

            {!filterSelected && (
              <StyledIcon $isMenuOpen={expanded} icon={faAngleDown} />
            )}
          </MainButton>
          {filterSelected && (
            <CloseButton
              small={buttonSize === 'small'}
              medium={buttonSize === 'medium'}
              onClick={onClearFilter}
            >
              <CloseContent>
                <FontAwesomeIcon icon={faCircleXmark} />
              </CloseContent>
            </CloseButton>
          )}
        </ButtonsWrapper>
      }
      gap={16}
      onOpen={() => setExpanded(true)}
      onClose={() => setExpanded(false)}
    >
      {({ closeDropdown }) =>
        typeof children === 'function' ? children({ closeDropdown }) : children
      }
    </Dropdown>
  );
};

export default FilterInDropdown;
