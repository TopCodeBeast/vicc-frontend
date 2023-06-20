import { AppBarProps, AppBar as MuiAppBar } from '@material-ui/core';
import classnames from 'classnames';
import styled from 'styled-components';

import Container from '@sorare/core/src/atoms/layout/Container';

interface Props extends Omit<AppBarProps, 'position'> {
  position: 'top' | 'bottom';
  justify?: 'left' | 'space-between' | 'right';
}

const AppBar = styled(MuiAppBar)`
  color: inherit;
  height: 60px;
  align-items: center;
  flex-direction: row;
  box-shadow: none;
  background-color: var(--c-dialog-background);
  &.top {
    top: 0;
    bottom: auto;
  }
  &.bottom {
    top: auto;
    bottom: 0;
  }
`;
const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${AppBar}.left & {
    justify-content: flex-start;
  }
  ${AppBar}.right & {
    justify-content: flex-end;
  }
`;

export const FixedAppBar = ({
  position,
  justify = 'space-between',
  children,
}: Props) => {
  return (
    <AppBar position="fixed" className={classnames(position, justify)}>
      <Container>
        <StyledContainer>{children}</StyledContainer>
      </Container>
    </AppBar>
  );
};

export default FixedAppBar;
