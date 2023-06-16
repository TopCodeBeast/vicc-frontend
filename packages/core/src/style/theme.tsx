import { faCaretRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  MuiThemeProvider,
  StylesProvider,
  createTheme,
  jssPreset,
} from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import createSpacing from '@material-ui/core/styles/createSpacing';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { ReactNode, useMemo } from 'react';
import { css } from 'styled-components';

import rewardBackground from '@sorare/core/src/assets/so5/reward-background.png';
// import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { cardRatio } from '@sorare/core/src/lib/cardPicture';

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

const breakpoints = createBreakpoints({
  values: {
    xs: 0, // deprecated
    sm: 600, // deprecated
    md: 960, // deprecated
    lg: 1280, // deprecated
    xl: 1920, // deprecated
    mobile: 360,
    tablet: 720,
    laptop: 960,
    desktop: 1200,
  },
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

const horizontalGradient = (
  from: string,
  to: string,
  { reversed } = { reversed: false }
) => `linear-gradient(${reversed ? 270 : 90}deg, ${from}, ${to})`;

const verticalGradient = (
  from: string,
  to: string,
  { reversed } = { reversed: false }
) => `linear-gradient(${reversed ? 180 : 0}deg, ${from}, ${to})`;

const radialGradient = (...properties: string[]) =>
  `radial-gradient(${properties.join(', ')})`;

const colors = {
  horizontalGradient,
  verticalGradient,
  radialGradient,
  headerGradient: (
    customBanner?: {
      colorLeft: string | null;
      colorRight: string | null;
    } | null
  ) =>
    horizontalGradient(
      customBanner?.colorLeft ?? 'var(--c-brand-800)',
      customBanner?.colorRight ?? 'var(--c-brand-600)'
    ),
};

const borders = {
  black: `1px solid var(--c-neutral-1000)`,
  grey: `1px solid var(--c-neutral-300)`,
  blue: `2px solid var(--c-brand-600)`,
  green: `1px solid var(--c-green-600)`,
};

const boxShadow = {
  100: `0px 1px 6px rgba(0, 0, 0, 0.1)`,
  200: `0px 3px 12px rgba(0, 0, 0, 0.1)`,
};

const typography = {
  fontFamily: 'apercu-pro, system-ui, sans-serif',
  button: {
    ...fonts.sorareBold,
    fontSize: 16,
    textTransform: 'none' as const, // this is tricky as buttons should be uppercased as per ML design but we use buttons style where they doesn't looks like buttons (menu)
  },
};

export const theme = {
  spacing,
  styledFonts: {
    drukWideSuper: css`
      font-family: DrukWide-Super, sans-serif;
      font-style: normal;
      font-weight: 950;
    `,
  },
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
  colors,
  borders,
  boxShadow,
  backgrounds: {
    veryDenseStroke: `repeating-linear-gradient(-45deg, var(--c-neutral-100), var(--c-neutral-100) 1px, var(--c-neutral-400) 1px, var(--c-neutral-400) 2px)`,
    rewards: `url(${rewardBackground}), radial-gradient(54.58% 54.58% at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), #222845`,
  },
  card: {
    getHeight(width: number) {
      return width / cardRatio;
    },
    dimensions(width: number) {
      return {
        width,
        height: width / cardRatio,
      };
    },
    shadow: '0px 5px 20px 5px rgba(0, 0, 0, 0.4)',
    lightShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  cardGrid: {
    card: {
      mobileWidth: 110,
      dialogWidth: 144,
    },
  },
  layout: {
    appBarWidth: 1200,
    paddingTop: 69,
    width: 1340,
    mediumWidth: 960,
    gridMargin: 30,
    promotionalBannerHeight: 30,
    navbarOffset: 45,
    drawerContainerMargin: '45px auto',
    dialogWidth: 480,
  },
  fonts,
  typography,
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
        [breakpoints.up('sm')]: {
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
        borderLeft: borders.grey,
        borderRight: borders.grey,
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
        border: borders.grey,
        '&.Mui-focused': {
          border: borders.grey,
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
        borderBottom: borders.grey,
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
  breakpoints,
  fontSize: {
    small: 12,
    medium: 14,
    normal: 16,
    big: 20,
    bigger: 24,
    biggest: 32,
  },
  lineHeight: {
    small: '16px',
    normal: '20px',
    big: '28px',
    bigger: '32px',
    biggest: '36px',
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
  radius: {
    xxs: borderRadius / 2, // 4
    xs: borderRadius, // 8
    sm: borderRadius * 1.5, // 12
    md: borderRadius * 2, // 16
    lg: borderRadius * 2.5, // 20
    xl: borderRadius * 3, // 24
    chip: '2em',
    circle: '50%',
  },
};

export type CustomTheme = typeof theme;

declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: true; // deprecated
    sm: true; // deprecated
    md: true; // deprecated
    lg: true; // deprecated
    xl: true; // deprecated
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }

  interface Breakpoints {
    /** @deprecated */
    down: Breakpoints['down'];

    /** @deprecated */
    between: Breakpoints['between'];
  }
}

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
  const dir = 'ltr'; // const { dir } = useIntlContext(); //TODO

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
