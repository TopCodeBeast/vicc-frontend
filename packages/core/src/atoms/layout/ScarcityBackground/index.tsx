import classnames from 'classnames';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';

const Root = styled.section`
  color: var(--c-neutral-1000);
  background: no-repeat 100% 100vh, var(--bg, var(--c-gradient-common));
  &.common,
  &.money {
    --bg: var(--c-gradient-common);
    color: var(--c-static-neutral-1000);
  }
  &.limited {
    --bg: var(--c-gradient-limited);
    color: var(--c-static-neutral-100);

    &.BASEBALL {
      box-shadow: inset 1px 1px 2px #fed867;
      background: linear-gradient(336.6deg, #db7e1e -0.12%, #fbd962 99.62%);
    }
  }
  &.rare,
  &.rare_pro {
    --bg: var(--c-gradient-rare);
    color: var(--c-static-neutral-100);
  }
  &.super_rare {
    --bg: var(--c-gradient-superRare);
    color: var(--c-static-neutral-100);
  }
  &.unique {
    --bg: var(--c-gradient-unique);
    color: var(--c-static-neutral-100);
  }
  &.custom_series {
    --bg: var(--c-gradient-customSeries);
    color: var(--c-static-neutral-100);
  }
  &.mix {
    --bg: var(--c-gradient-mix);
    color: var(--c-static-neutral-100);
  }
`;

type Props = {
  className?: string;
} & HTMLAttributes<HTMLElement>;

export const ScarcityBackground: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className = '',
  ...elementProps
}) => {
  return (
    <Root className={classnames(className)} {...elementProps}>
      {children}
    </Root>
  );
};
