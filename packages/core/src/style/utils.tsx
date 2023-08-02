import * as React from 'react';
import styled, {
  FlattenInterpolation,
  SimpleInterpolation,
  createGlobalStyle,
  css,
} from 'styled-components';

export const hideScrollbar = css`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox (CSS standard) */

  /* Webkit (Chrome, Safari and Opera) */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export function OverrideClasses<
  C extends React.ComponentType<React.PropsWithChildren<any>>,
  P extends object,
  T extends { [name: string]: SimpleInterpolation }
>(
  Base: C,
  baseStyles: null | FlattenInterpolation<P>,
  overrides: T,
  attrs: any = {}
): [C, { [K in keyof T]: string }] {
  // Generate unique sc-prefix without the period
  const Unique = styled.div``;
  const prefix = Unique.toString().slice(1);

  const newStyles = Object.entries(overrides).map(([key, value]) => {
    const className = `${prefix}--${key}`;

    return {
      css: css`
        .${className} {
          ${value}
        }
      `,
      key,
      className,
    };
  });

  const Main = styled(Base).attrs(attrs)`
    ${baseStyles}
  `;

  const GlobalStyles = createGlobalStyle`
    ${newStyles.map(e => e.css)}
  `;

  const classes = newStyles.reduce(
    (acc, { key, className }) => ({ ...acc, [key]: className }),
    {}
  );

  // We need to inject globalStyles
  const Wrapper = (props: any) => (
    <>
      <GlobalStyles />
      <Main {...props} />
    </>
  );

  // @ts-expect-error Types are invalid
  return [Wrapper, classes];
}

// styled.div``.toString() returns a unique string of the form .sc-HASH
// We get the unique HASH from it
const unique = () => styled.div``.toString().slice(4);

// Inspired by vanilla-extract for the API
// https://vanilla-extract.style/documentation/api/create-var/
// We start these private variables with three dashes to be more explicit

/**
 * This utility function allows us to create scoped CSS properties
 *
 * This allows us to reduce code duplication when injecting
 * dynamic props into styled-components.
 *
 * @example
 * const background = createVar();
 * const mobileBackground = createVar('mobile')
 *
 * const Styled = styled.div`
 *   background: var(${mobileBackground});
 *  '@media (screen and min-width: 200px)` {
 *     background: var(${background});
 *   }
 * `;
 *
 * <Styled style={{
 *   [background]: 'linear-gradient(red, blue)'
 *   [mobileBackground]: 'linear-gradient(blue, red)'
 * }} />
 *
 */
export const createVar = <T extends string>(
  // @ts-expect-error `label: T = ''` is not well understood by tsc
  label: T = ''
): `---${string}-${T}` => `---${unique()}-${label}`;

export const stroke = (size = `1px`, color = `var(--c-brand-600)`) => {
  /* outline the border of the image respecting transparency */
  /* size is divided by 2 as stacking 8 drop shadows has a compounding effect */
  /* https://stackoverflow.com/a/55012328/332389 */
  return css`
    --stroke-size: calc(${size} / 2);
    --stroke-color: ${color};

    filter: drop-shadow(0 var(--stroke-size) 0 var(--stroke-color))
      drop-shadow(var(--stroke-size) 0 0 var(--stroke-color))
      drop-shadow(calc(-1 * var(--stroke-size)) 0 0 var(--stroke-color))
      drop-shadow(0 calc(-1 * var(--stroke-size)) 0 var(--stroke-color))
      drop-shadow(var(--stroke-size) var(--stroke-size) 0 var(--stroke-color))
      drop-shadow(
        var(--stroke-size) calc(-1 * var(--stroke-size)) 0 var(--stroke-color)
      )
      drop-shadow(
        calc(-1 * var(--stroke-size)) var(--stroke-size) 0 var(--stroke-color)
      )
      drop-shadow(
        calc(-1 * var(--stroke-size)) calc(-1 * var(--stroke-size)) 0
          var(--stroke-color)
      );
  `;
};
