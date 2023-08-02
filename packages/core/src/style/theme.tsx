import { faCaretRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  MuiThemeProvider,
  StylesProvider,
  createTheme,
  jssPreset,
} from '@material-ui/core/styles';
import createSpacing from '@material-ui/core/styles/createSpacing';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { ReactNode, useMemo } from 'react';

import { useIntlContext } from '@core/contexts/intl';

import { tabletAndAbove } from './mediaQuery';

// Inject jss styles first in order to override them with Styled-components without resorting to && or important
// Inspired by https://v4.mui.com/guides/interoperability/#controlling-priority-3
// We can't use injectFirst as we override jss, so we need to handle this ourselves
// https://github.com/mui/material-ui/blob/b2e1f01ef7d2433c92829dffd30e4ba484bd3d4f/packages/mui-styles/src/StylesProvider/StylesProvider.js#L85-L89
const injectFirstNode = document.createComment('mui-inject-first');
document.head.insertBefore(injectFirstNode, document.head.firstChild);
export const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: injectFirstNode,
});

const spacing = createSpacing(10);

const borderRadius = 8;

const font = (
  fontFamily: string,
  fontWeight: number,
  opts = {}
): { fontFamily: string; fontWeight: number; fontStyle: string } => ({
  fontFamily,
  fontWeight,
  fontStyle: 'normal',
  ...opts,
});

const fonts = {
  sorareRegular: font('apercu-pro, system-ui, sans-serif', 400),
  sorareBold: font('apercu-pro, system-ui, sans-serif', 900),
};

export const theme = {
  spacing,
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    mobileStepper: 1000,
    modal: 1300,
    snackbar: 1400,
    speedDial: 1050,
    tooltip: 1500,
  },
  palette: {
    primary: {
      main: '#4C61EE', // Necessary duplicate for css variable palette because MUI use alpha/darken/lighten internally.
    },
    secondary: {
      light: '#ddd',
      main: '#000',
      dark: '#cccccc',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: 'var(--sorareFont)',
    button: {
      ...fonts.sorareBold,
      fontSize: 16,
      textTransform: 'none' as const, // this is tricky as buttons should be uppercased as per ML design but we use buttons style where they doesn't looks like buttons (menu)
    },
  },
  props: {
    MuiInputAdornment: {
      disableTypography: true,
    },
    MuiMenu: {
      anchorOrigin: {
        horizontal: 'center' as const,
        vertical: 'bottom' as const,
      },
      transformOrigin: {
        horizontal: 'center' as const,
        vertical: 'top' as const,
      },
    },
    MuiBreadcrumbs: {
      separator: <FontAwesomeIcon icon={faCaretRight} />,
    },
  },
  overrides: {
    MuiBadge: {
      badge: {
        ...fonts.sorareBold,
        borderRadius: 12,
        padding: 0,
        fontSize: 12,
        color: 'white',
        backgroundColor: 'var(--c-red-600)',
      },
    },
    MuiButton: {
      startIcon: {
        marginRight: 'var(--unit)',
        marginLeft: 0,
      },
      iconSizeMedium: {
        '& > :first-child': {
          maxWidth: 30,
          maxHeight: 30,
          fontSize: 'inherit',
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius,
        boxShadow: '0px 14px 54px rgba(0, 0, 0, 0.1)',
        maxWidth: 'unset',
        color: 'var(--c-neutral-1000)',
        fontSize: 12,
        lineHeight: '16px',
      },
      arrow: {
        color: 'white',
      },
    },
    MuiDivider: {
      root: { backgroundColor: 'var(--c-neutral-400)' },
    },
    MuiPaper: {
      root: {
        color: 'var(--c-neutral-1000)',
        '.light-theme &': {
          color: 'var(--c-static-neutral-1000)',
        },
      },
      rounded: {
        borderRadius,
      },
      elevation1: {
        boxShadow: '0px 14px 54px rgba(0, 0, 0, 0.2)',
      },
      elevation8: {
        boxShadow: '0px 14px 54px rgba(0, 0, 0, 0.2)',
      },
    },
    MuiPagination: {
      root: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    MuiPaginationItem: {
      root: {
        color: 'var(--c-neutral-1000)',
      },
      page: {
        '&$selected': {
          backgroundColor: 'var(--c-neutral-400)',
        },
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(var(--c-static-rgb-neutral-1000), 0.6)',
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        color: 'var(--c-neutral-600)',
        '&$checked': {
          color: 'var(--c-brand-600)',
        },
      },
      root: {
        '& .MuiIconButton-label': {
          position: 'relative',
          zIndex: 0,
        },
        '&:not($checked) .MuiIconButton-label:after': {
          content: '""',
          left: 4,
          top: 4,
          height: 15,
          width: 15,
          position: 'absolute',
          backgroundColor: 'white',
          zIndex: -1,
        },
      },
    },
    MuiSwitch: {
      root: {
        width: 40,
        height: 20,
        padding: 0,
        margin: 10,
      },
      switchBase: {
        padding: 2,
        '&$checked': {
          transform: 'translateX(16px)',
          color: 'var(--c-static-neutral-100) !important',
          '& + $track': {
            backgroundColor: `var(--c-brand-600)!important`,
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 16,
        height: 16,
      },
      track: {
        borderRadius: '29px',
        backgroundColor: 'var(--c-neutral-400)',
        opacity: 1,
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiListItem: {
      root: {
        borderRadius: 0,
        '&:hover, &.Mui-selected, &.Mui-selected:hover': {
          color: 'var(--c-brand-600)',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiListItemText: {
      primary: {
        ...fonts.sorareBold,
        fontSize: 15,
        lineHeight: '24px',
        color: 'var(--c-neutral-1000)',
        letterSpacing: 0,
        '.Mui-selected &': {
          color: 'var(--c-brand-600)',
        },
      },
      secondary: {
        lineHeight: 1.2,
        fontSize: 15,
      },
      multiline: {
        marginTop: 0,
        marginBottom: 0,
      },
    },
    MuiInputAdornment: {
      root: {
        ...fonts.sorareRegular,
        fontSize: 15,
        color: 'var(--c-neutral-1000)',
      },
      positionEnd: {
        marginLeft: 0,
      },
    },
    MuiInputBase: {
      root: {
        ...fonts.sorareRegular,
        fontSize: 15,
        boxShadow: 'none',
        color: 'var(--c-neutral-600)',
        '&.Mui-focused': {
          color: 'var(--c-neutral-1000)',
        },
      },
    },
    MuiTableContainer: {
      root: {
        padding: 5,
      },
    },
    MuiTableHead: {
      root: {
        '& > tr > th': {
          color: 'var(--c-neutral-600)',
        },
      },
    },
    MuiTableCell: {
      root: {
        padding: 5,
        [`@media ${tabletAndAbove}`]: {
          padding: 16,
        },
        borderBottom: 'none',
      },
      head: {
        '& > tr > th': {
          display: 'flex',
          alignItems: 'flex-end',
        },
      },
    },
    MuiTableRow: {
      root: {
        borderLeft: '1px solid var(--c-neutral-300)',
        borderRight: '1px solid var(--c-neutral-300)',
      },
      head: {
        borderLeft: 'none',
        borderRight: 'none',
      },
    },
    MuiSelect: {
      outlined: {
        padding: 10,
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: 'var(--c-neutral-100)',
        borderRadius,
        border: '1px solid var(--c-neutral-300)',
        '&.Mui-focused': {
          border: '1px solid var(--c-neutral-300)',
        },
        '.updateEmail &': {
          backgroundColor: 'var(--c-neutral-300)',
        },
      },
      notchedOutline: {
        border: 'none',
      },
      input: {
        padding: spacing(2),
        '&:not(:placeholder-shown)': {
          color: 'var(--c-neutral-1000)',
        },
      },
    },
    MuiInputLabel: {
      root: {
        marginBottom: 'calc(1 * var(--unit))',
        fontSize: 15,
        lineHeight: '24px',
        color: 'var(--c-neutral-1000)',
        ...fonts.sorareBold,
      },
      outlined: {
        transform: 'none',
        position: 'relative' as any,

        '&.MuiInputLabel-shrink': {
          transform: 'none',
        },
        '.updateEmail &': {
          display: 'none',
          '&.Mui-error': {
            display: 'block',
          },
        },
      },
      formControl: {
        transform: 'none',
        position: 'relative' as any,
        '&.Mui-focused': {
          color: 'var(--c-neutral-1000)',
        },
      },
    },
    MuiFormControl: {
      marginNormal: {
        marginTop: 0,
        marginBottom: 0,
      },
    },
    MuiMenuItem: {
      root: {
        ...fonts.sorareBold,
        fontSize: 15,
        lineHeight: '22px',
        color: 'var(--c-neutral-1000)',
        '&:hover': {
          color: 'var(--c-brand-600)',
        },
      },
    },
    MuiTabs: {
      root: {
        borderBottom: '1px solid var(--c-neutral-300)',
        backgroundColor: 'var(--c-neutral-100)',
      },
      indicator: {
        backgroundColor: 'var(--c-brand-600)',
        '.dark-theme &': {
          backgroundColor: 'var(--c-neutral-1000)',
        },
      },
    },
    MuiDialog: {
      root: {
        // Dialogs are injected as children of body so they can be selected using the `~` selector
        // If a dialog is injected after the ConnectionDialog, it should be displayed over that dialog
        // And the absolutely positioned iframe at zIndex 1301.
        '[data-dialog=ConnectionDialog] ~ &': {
          zIndex: '1500 !important',
        },
      },
    },
    MuiTab: {
      root: {
        fontSize: 15,
        lineHeight: '24px',
        minWidth: '0 !important',
        '&$selected': {
          ...fonts.sorareBold,
          color: 'var(--c-brand-600)',
          '.dark-theme &': {
            color: 'var(--c-neutral-1000)',
          },
        },
        '&:not($selected)': {
          ...fonts.sorareRegular,
          color: 'var(--c-neutral-600)',
        },
      },
    },
    MuiTypography: {
      colorSecondary: {
        color: 'var(--c-neutral-600)',
      },
      colorTextSecondary: {
        color: 'var(--c-neutral-600)',
      },
      colorTextPrimary: {
        color: 'var(--c-neutral-1000)',
      },
    },
    MuiSlider: {
      thumb: {
        backgroundColor: 'white',
        border: `solid 2px var(--c-neutral-1000)`,
        height: 16,
        width: 16,
        marginTop: -6,
        '&:hover': {
          boxShadow: `0px 0px 0px 8px rgba(0,0,0, .1)`,
        },
      },
      track: {
        backgroundColor: 'var(--c-neutral-1000)',
        height: 3,
      },
      rail: {
        backgroundColor: 'var(--c-neutral-600)',
      },
    },
  },
  mlColors: {
    scarcity: {
      common: `var(--c-gradient-common)`,
      limited: `var(--c-gradient-limited)`,
      rare: `var(--c-gradient-rare)`,
      superRare: `var(--c-gradient-superRare)`,
      superRareMlb: `var(--c-gradient-superRareMlb)`,
      unique: `var(--c-gradient-unique)`,
      mix: `var(--c-gradient-mix)`,
      worldCup: `var(--c-gradient-worldCup)`,
      customSeries: `var(--c-gradient-customSeries)`,
    },
  },
  shape: {
    borderRadius,
  },
};

export type CustomTheme = typeof theme;

declare module '@material-ui/core/styles/createTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends CustomTheme {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions extends CustomTheme {}
}

interface Props {
  children: ReactNode;
}

export const useDirectionalTheme = () => {
  const { dir } = useIntlContext();

  return useMemo(() => createTheme({ ...theme, direction: dir }), [dir]);
};

const ThemeProvider = ({ children }: Props) => {
  const directionalTheme = useDirectionalTheme();
  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider
        theme={{
          ...directionalTheme,
        }}
      >
        {children}
      </MuiThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProvider;
