import { Tab as MuiTab } from '@material-ui/core';
import { TabProps } from '@material-ui/core/Tab/Tab';
import { ForwardedRef, forwardRef } from 'react';
import { css } from 'styled-components';

import { OverrideClasses } from '@core/style/utils';

type Props = Omit<TabProps, 'classes'>;

const [StyledTab, classes] = OverrideClasses(MuiTab, null, {
  root: css`
    text-transform: none;
  `,
  wrapper: css`
    flex-direction: row;
    gap: 10px;
  `,
  labelIcon: css`
    min-height: unset;
    padding-top: unset;
  `,
});

const RawTab = (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
  const { ...rest } = props;

  return <StyledTab {...rest} ref={ref} classes={classes} />;
};

export const Tab = forwardRef<HTMLDivElement, Props>(RawTab);

export default Tab;
