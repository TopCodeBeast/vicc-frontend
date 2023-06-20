import { IconDefinition, faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@material-ui/core';
import ReactSelect, { components } from 'react-select';

import selectStyle from './style';

export interface Props<T> {
  icon?: IconDefinition;
  menuLateralAlignment?: 'left' | 'right';
  onChange?: (option?: T | null) => void;
  menuPosition?: 'fixed';
  options?: T[];
  value?: T;
  menuPortalTarget?: HTMLElement;
  menuPlacement?: 'top';
  isDisabled?: boolean;
}

const DropdownIndicator = (props: any) => {
  const { icon, ...rest } = props;
  return (
    <components.DropdownIndicator {...rest}>
      <FontAwesomeIcon icon={icon} />
    </components.DropdownIndicator>
  );
};

const Select = <T,>({
  icon = faCaretDown,
  menuLateralAlignment = 'left',
  menuPortalTarget = undefined,
  ...rest
}: Props<T>) => {
  const theme = useTheme();
  const themedStyle = selectStyle(theme);
  if (menuLateralAlignment === 'right') {
    const existingMenu = themedStyle.menu;
    themedStyle.menu = (provided: any) => ({
      ...existingMenu(provided),
      left: 'unset',
    });
  }
  return (
    <ReactSelect
      styles={themedStyle}
      openMenuOnFocus
      menuPortalTarget={menuPortalTarget}
      components={{
        DropdownIndicator: props => (
          <DropdownIndicator icon={icon} {...props} />
        ),
      }}
      isSearchable={false}
      {...rest}
    />
  );
};

export default Select;
