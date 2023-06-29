const backgroundColor = 'transparent';

export default (theme: any) => {
  const color = 'var(--c-neutral-1000)';

  const defaultContainer = (base: any) => ({
    ...base,
    color,
    display: 'inline-block',
    minWidth: 'max-content',
  });

  const defaultControl = (base: any) => ({
    ...base,
    border: 'none',
    borderColor: 'transparent',
    '&:hover': {
      borderColor: 'transparent',
    },
    boxShadow: 'none',
    borderRadius: 'var(--unit)',
    backgroundColor,
    minHeight: 'auto',
    cursor: 'pointer',
    '& div': {
      overflow: 'visible',
    },
    height: '100%',
  });

  const defaultIndicatorSeparator = () => ({
    display: 'none',
  });

  const defaultInput = (base: any) => ({
    ...base,
    padding: 0,
    margin: 0,
  });

  const defaultValueContainer = (base: any) => ({
    ...base,
    paddingLeft: 0,
    lineHeight: 1,
  });

  const defaultSingleValue = (base: any) => ({
    ...base,
    color,
    position: 'relative',
    margin: 0,
    transform: 'none',
    maxWidth: 'initial',
  });

  const defaultOption = (base: any) => ({
    ...base,
    fontFamily: 'var(--sorareFont)',
    fontSize: 14,
    color: 'var(--c-neutral-1000)',
    textAlign: 'left',
    cursor: 'pointer',
    padding: '0 var(--unit) 0 var(--double-unit)',
    backgroundColor: 'var(--c-neutral-100)',
    '&:hover': {
      backgroundColor: 'var(--c-neutral-200)',
    },
  });

  const defaultClearIndicator = (base: any) => ({
    ...base,
    padding: 0,
    margin: 0,
  });

  const defaultPlaceholder = (base: any) => ({
    ...base,
    color,
    position: 'relative',
    transform: 'none',
  });

  const defaultMenu = (base: any) => ({
    ...base,
    zIndex: 99,
    minWidth: 'max-content',
    width: '100%',
    left: 0,
    right: 0,
    margin: '0',
    padding: 0,
    borderRadius: 4,
    border: '1px solid #EDEDED',
    overflow: 'hidden',
    boxShadow: 'none',
  });
  const defaultMenuPortal = (base: any) => ({
    ...base,
    zIndex: theme.zIndex.modal,
  });

  const defaultMenuList = (base: any) => ({
    ...base,
  });

  const defaultDropdownIndicator = (base: any, state: any) => {
    const {
      selectProps: { menuIsOpen },
    } = state;
    const transform = menuIsOpen ? 'rotate(-180deg)' : 'none';
    return {
      ...base,
      marginRight: 'var(--unit)',
      [theme.breakpoints.up('sm')]: {
        marginRight: 'var(--double-unit)',
      },
      padding: 0,
      transition: 'transform 0.25s ease-out',
      transform: !menuIsOpen ? '' : transform,
    };
  };

  const defaults = {
    container: defaultContainer,
    control: defaultControl,
    indicatorSeparator: defaultIndicatorSeparator,
    input: defaultInput,
    valueContainer: defaultValueContainer,
    singleValue: defaultSingleValue,
    option: defaultOption,
    clearIndicator: defaultClearIndicator,
    placeholder: defaultPlaceholder,
    menu: defaultMenu,
    menuPortal: defaultMenuPortal,
    menuList: defaultMenuList,
    dropdownIndicator: defaultDropdownIndicator,
  };

  return {
    ...defaults,
    container: (base: any) => ({
      ...defaultContainer(base),
      border: `2px solid var(--c-neutral-300)`,
      borderRadius: 'var(--quadruple-unit)',
      '.dark-theme &': {
        border: `2px solid var(--c-neutral-400)`,
      },
    }),
    control: (base: any) => ({
      ...defaultControl(base),
      padding:
        'var(--unit) var(--intermediate-unit) var(--unit) var(--double-unit)',
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...defaultDropdownIndicator(base, state),
      color: 'var(--c-neutral-600)',
      marginRight: 0,
      '&:hover': {
        color: 'var(--c-neutral-600)',
      },
      [theme.breakpoints.up('sm')]: {
        marginRight: 'var(--half-unit)',
      },
    }),
    menu: (base: any) => ({
      ...defaultMenu(base),
      borderRadius: 'var(--double-unit)',
      border: 'none',
      boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'var(--c-neutral-200)',
    }),
    menuList: (base: any) => ({
      ...defaultMenuList(base),
      padding: 'var(--unit)',
    }),
    option: (base: any, state: any) => {
      let bgColorOption = 'var(--c-neutral-200)';
      if (state.isSelected) {
        bgColorOption = 'var(--c-neutral-300)';
      }
      if (state.isFocused && !state.isSelected) {
        bgColorOption = 'rgba(var(--c-rgb-neutral-300), 0.3)';
      }
      return {
        ...base,
        position: 'relative',
        color: 'var(--c-neutral-1000)',
        backgroundColor: bgColorOption,
        borderRadius: state.isSelected || state.isFocused ? 'var(--unit)' : 0,
        cursor: 'pointer',
        minWidth: 200,
        borderTop: `1px solid transparent`,
        '&:first-of-type': {
          borderTopColor: 'transparent',
        },
        '& + *': {
          borderColor: bgColorOption,
        },
        '&:active': {
          backgroundColor: 'var(--c-neutral-300)',
        },
      };
    },
  };
};
