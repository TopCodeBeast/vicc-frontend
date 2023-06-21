import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import BackButton from '@core/atoms/buttons/BackButton';
import { theme } from '@core/style/theme';

type Props = {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  backButton?: ReactNode;
  onBackButton?: () => void;
  stickyHeader?: boolean;
  noPadding?: boolean;
  footer?: ReactNode;
};

const Root = styled.div`
  width: 100%;
  &.stickyHeader {
    max-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;
const Content = styled.div`
  padding: var(--double-unit);
  &.stickyHeader {
    flex: 1;
    overflow: auto;
  }
  &.noPadding {
    padding: 0;
  }
`;
const Nav = styled.div`
  position: relative;
  min-height: 60px;
  border-bottom: ${theme.borders.grey};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.div`
  flex: 1;
  text-align: center;
  margin: 0 var(--unit);
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: var(--double-unit);
  min-width: 40px;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: var(--double-unit);
  min-width: 40px;
`;
const Footer = styled.div`
  position: relative;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 var(--double-unit);
`;

export const DialogContentWithNavigation = (props: Props) => {
  const {
    children,
    onBackButton,
    backButton: backButtonCustom,
    title,
    right,
    stickyHeader,
    noPadding,
    footer,
  } = props;
  return (
    <Root className={classnames({ stickyHeader })}>
      <Nav>
        <Left>
          {backButtonCustom}
          {!backButtonCustom && onBackButton && (
            <BackButton onClick={onBackButton} />
          )}
        </Left>
        <Title>{title}</Title>
        <Right>{right || null}</Right>
      </Nav>
      <Content className={classnames({ stickyHeader, noPadding })}>
        {children}
      </Content>
      {footer && <Footer>{footer}</Footer>}
    </Root>
  );
};

export default DialogContentWithNavigation;
