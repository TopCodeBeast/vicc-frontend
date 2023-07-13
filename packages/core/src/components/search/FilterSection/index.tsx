import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--unit);
  position: relative;
`;
const ListOptionsContainer = styled.div`
  width: 100%;
`;

type Props = {
  children: ReactNode;
  hidden?: boolean;
  search?: ReactNode;
};

export const FilterSection = ({ children, hidden, search }: Props) => {
  return (
    <ListContainer className={classNames('FilterWidget', { visible: !hidden })}>
      {search}
      <ListOptionsContainer>{children}</ListOptionsContainer>
    </ListContainer>
  );
};
