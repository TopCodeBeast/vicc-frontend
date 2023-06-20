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
    borderRadius: theme.shape.borderRadius,
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

  const defaultMultiValue = (base: any) => ({
    ...base,
    backgroundColor: theme.palette.primary,
    maxWidth: 60,
    [theme.breakpoints.up('laptop')]: {
      maxWidth: 120,
    },
    marginLeft: 2,
    borderRadius: 10,
    color,
    paddingRight: 0,
  });

  const defaultMultiValueRemove = (base: any) => ({
    ...base,
    ':hover': {
      backgroundColor: 'var(--c-neutral-200)',
    },
    borderRadius: 10,
  });

  const defaultMultiValueLabel = (base: any) => ({
    ...base,
    color: 'var(--c-neutral-100)',
    textTransform: 'uppercase',
  });

  const defaultOption = (base: any) => ({
    ...base,
    ...theme.fonts.sorareRegular,
    fontSize: 14,
    color: 'var(--c-neutral-1000)',
    textAlign: 'left',
    cursor: 'pointer',
    padding: theme.spacing(0, 1, 0, 2),
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
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(2),
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
    multiValue: defaultMultiValue,
    multiValueRemove: defaultMultiValueRemove,
    multiValueLabel: defaultMultiValueLabel,
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
      borderRadius: theme?.radius?.chip,
      '.dark-theme &': {
        border: `2px solid var(--c-neutral-400)`,
      },
    }),
    control: (base: any) => ({
      ...defaultControl(base),
      padding: theme.spacing(0.75, 1, 0.75, 1.5),
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...defaultDropdownIndicator(base, state),
      color: 'var(--c-neutral-600)',
      marginRight: 0,
      '&:hover': {
        color: 'var(--c-neutral-600)',
      },
      [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(0.5),
      },
    }),
    menu: (base: any) => ({
      ...defaultMenu(base),
      borderRadius: theme.radius?.md,
      border: 'none',
      boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'var(--c-neutral-200)',
    }),
    menuList: (base: any) => ({
      ...defaultMenuList(base),
      padding: theme.spacing(1),
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
        borderRadius: state.isSelected || state.isFocused ? theme.radius.xs : 0,
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
