import { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export type StyleProps = {
  color?: 'black' | 'grey' | 'red' | 'yellow' | 'white' | 'blue' | 'green';
  round?: boolean;
  small?: boolean;
  $stroke?: boolean;
};

export type Props = HTMLAttributes<HTMLSpanElement> & StyleProps;

export const Tag = styled.span<StyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--double-unit);
  padding: var(--half-unit) var(--unit);
  line-height: var(--double-unit);
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  ${({ round }) => {
    if (round) {
      return css`
        height: 2.5em;
        line-height: 2.5em;
        border-radius: 1.25em;
        min-width: 2.5em;
        padding: 0;
      `;
    }
    return undefined;
  }}
  ${({ small }) => {
    if (small) {
      return css`
        height: auto;
        line-height: var(--triple-unit);
        min-width: var(--triple-unit);
        font-size: var(--intermediate-unit);
        padding-top: 0;
        padding-bottom: 0;
      `;
    }
    return undefined;
  }}

  ${({ color = 'black', $stroke }) => {
    switch (color) {
      case 'grey':
        return css`
          background-color: var(--c-neutral-300);
          color: var(--c-neutral-1000);
        `;
      case 'red':
        return css`
          background-color: var(--c-neutral-100);
          color: var(--c-static-red-300);
          border: 1px solid var(--c-static-red-300);
        `;
      case 'yellow':
        return css`
          background-color: var(--c-yellow-300);
          color: var(--c-neutral-1000);
          border: 1px solid var(--c-yellow-300);
        `;
      case 'white':
        return css`
          background-color: var(--c-neutral-100);
          color: var(--c-neutral-1000);
          ${$stroke ? `border: 1px solid var(--c-neutral-400);` : ``};
        `;
      case 'blue':
        return css`
          background-color: rgba(var(--c-rgb-brand-600), 0.25);
          color: var(--c-brand-600);
        `;
      case 'green':
        return css`
          background-color: var(--c-green-600);
          color: var(--c-static-neutral-100);
        `;
      default:
        return css`
          background-color: var(--c-neutral-1000);
          color: var(--c-neutral-100);
        `;
    }
  }}
`;
