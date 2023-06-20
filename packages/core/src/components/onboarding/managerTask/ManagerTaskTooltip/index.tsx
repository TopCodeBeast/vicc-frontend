import { Tooltip as MuiTooltip, TooltipProps } from '@material-ui/core';
import { ReactNode } from 'react';
import { css } from 'styled-components';

import HighlightableWrapper from 'components/HighlightableWrapper';
import { useManagerTaskContext } from '@sorare/core/src/contexts/managerTask';
import { OverrideClasses } from '@sorare/core/src/style/utils';

type Props = {
  children?: ReactNode;
  name?: string | null;
  title: TooltipProps['title'];
  noBackdrop?: boolean;
  inModal?: boolean;
  forceAreaHighlight?: boolean;
  fullWidth?: boolean;
  placement?: TooltipProps['placement'];
  disable?: boolean;
  backgroundColor?: string;
};

const Tooltip = OverrideClasses(MuiTooltip, null, {
  tooltip: css`
    max-width: min(calc(100vw - var(--unit)), 340px);
    padding: var(--double-unit);
    background-color: var(--c-neutral-300);
    color: var(--c-neutral-1000);
  `,
  tooltipPlacementBottom: css`
    margin-top: var(--unit);
    margin-bottom: var(--unit);
  `,
  arrow: css`
    color: var(--c-neutral-300);
  `,
});

export const ManagerTaskTooltip = (props: Props) => {
  const {
    children,
    name,
    title,
    noBackdrop,
    placement,
    forceAreaHighlight = false,
    disable = false,
    backgroundColor,
  } = props;
  const [TooltipOverride, classes] = Tooltip;
  const { step } = useManagerTaskContext();
  const tooltipOpen = name === step;
  const highlightOpen = tooltipOpen || forceAreaHighlight;
  if (disable) return <>{children}</>;

  return (
    <HighlightableWrapper
      interactive={false}
      backgroundColor={backgroundColor}
      highlightOpen={highlightOpen}
      noBackdrop={noBackdrop}
    >
      <TooltipOverride
        arrow
        interactive
        title={title}
        open={tooltipOpen}
        placement={placement}
        classes={classes}
      >
        <span>{children}</span>
      </TooltipOverride>
    </HighlightableWrapper>
  );
};

export default ManagerTaskTooltip;
