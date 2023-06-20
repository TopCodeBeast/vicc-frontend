import { Tooltip as MuiTooltip, TooltipProps } from '@material-ui/core';
import styled, { css } from 'styled-components';

import { theme } from 'style/theme';
import { OverrideClasses } from 'style/utils';

type Props = Omit<TooltipProps, 'classes'> & {
  dark?: boolean;
};

const commonTooltipStyle = css`
  padding: var(--unit);
  box-shadow: var(--shadow-300);
  border-radius: ${theme.shape.borderRadius};
  max-width: min(calc(100vw - var(--unit)), 600px);
`;

const DarkTooltip = OverrideClasses(MuiTooltip, null, {
  tooltip: css`
    ${commonTooltipStyle}
    background-color: var(--c-neutral-1000);
    color: var(--c-neutral-100);
  `,
  arrow: css`
    color: var(--c-neutral-1000);
  `,
});

const LightTooltip = OverrideClasses(MuiTooltip, null, {
  tooltip: css`
    ${commonTooltipStyle}
    background-color: var(--c-neutral-100);
    color: var(--c-neutral-1000);
  `,
  arrow: css`
    color: var(--c-neutral-100);
  `,
});

const ContentWrapper = styled.span`
  /* without this display property ContentWrapper might have
   * height inconsistency issues (it could take up more height
   * than its children's)
   */
  display: inline-flex;
`;

export const Tooltip = ({
  children,
  interactive = true,
  dark = true,
  ...rest
}: Props) => {
  const [TooltipOverride, classes] = dark ? DarkTooltip : LightTooltip;
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
