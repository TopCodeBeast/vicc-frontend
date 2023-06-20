import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { theme } from '@sorare/core/src/style/theme';

const StyledBlock = styled(Block)`
  &.disabled {
    background-color: var(--c-neutral-200);
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    align-items: center;
    flex-direction: row;
    margin-bottom: 0;
  }
`;

const Ownerable = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

type Props = {
  children: ReactNode;
  actions?: ReactNode;
  helpers?: ReactNode;
  disabled?: boolean;
};

const CurrentOwnerSection = ({
  children,
  actions,
  helpers,
  disabled = false,
}: Props) => {
  return (
    <StyledBlock className={classNames({ disabled })}>
      <Content>
        <Left>
          {helpers}
          <Ownerable>{children}</Ownerable>
        </Left>
        {actions && <Right>{actions}</Right>}
      </Content>
    </StyledBlock>
  );
};

export default CurrentOwnerSection;
