import { ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

import Button, {
  Props as ButtonProps,
} from '@sorare/core/src/atoms/buttons/Button';

interface Props extends ButtonProps {
  moreText: ReactNode;
}

const Root = styled(Button)`
  display: flex;
  margin: 0px auto;
`;

export const ShowMoreButton = forwardRef<HTMLElement, Props>(
  function ShowMoreButton(props, ref) {
    const { moreText, ...rest } = props;
    return (
      <Root ref={ref} type="button" color="black" medium stroke {...rest}>
        {moreText}
      </Root>
    );
  }
);
