import { Tooltip as MuiTooltip, TooltipProps } from '@material-ui/core';
import styled, { css } from 'styled-components';

import { OverrideClasses } from '@core/style/utils';

type Props = Omit<TooltipProps, 'classes' | 'arrow'> & {
  arrow?: false;
};

const Root = OverrideClasses(MuiTooltip, null, {
  tooltip: css`
    padding: var(--unit);
    box-shadow: var(--shadow-300);
    max-width: min(calc(100vw - var(--double-unit)), 600px);
    background-color: var(--c-neutral-100);
    color: var(--c-neutral-1000);
    border: 1px solid rgba(var(--c-rgb-neutral-400), 0.5);
    .dark-theme & {
      background-color: var(--c-neutral-200);
    }
  `,
  arrow: css`
    &::before {
      border: 1px solid rgba(var(--c-rgb-neutral-400), 0.5);
      background-color: var(--c-neutral-100);
      .dark-theme & {
        background-color: var(--c-neutral-200);
      }
    }
  `,
});

const ContentWrapper = styled.span`
  /* without this display property ContentWrapper might have
   * height inconsistency issues (it could take up more height
   * than its children's)
   */
  display: inline-flex;
`;

export const Tooltip = ({ children, interactive = true, ...rest }: Props) => {
  const [TooltipOverride, classes] = Root;
  return (
    <TooltipOverride
      arrow
      interactive={interactive}
      classes={classes}
      {...rest}
    >
      <ContentWrapper>{children}</ContentWrapper>
    </TooltipOverride>
  );
};

export default Tooltip;
