import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  className?: string;
}

const StyledActions = styled.div`
  padding-top: 10px;
  display: flex;
  justify-content: center;
  & button:not(:first-child) {
    margin-left: 10px;
  }
`;

const Actions = ({ children, className }: Props) => {
  return <StyledActions className={className}>{children}</StyledActions>;
};

export default Actions;
