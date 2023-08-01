import classNames from 'classnames';
import styled from 'styled-components';

import {
  Button,
  Props as ButtonProps,
} from '@sorare/core/src/atoms/buttons/Button';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

const Wrapper = styled.span`
  position: relative;
  z-index: 1;
  &.fullWidth {
    flex: 1;
    justify-self: center;
  }
  @media ${laptopAndAbove} {
    &.fullWidth {
      flex: unset;
    }
  }
`;

const ListItemAction = (props: ButtonProps) => {
  const { fullWidth } = props;
  return (
    <Wrapper className={classNames({ fullWidth })}>
      <Button small color="white" {...props} />
    </Wrapper>
  );
};

export default ListItemAction;
