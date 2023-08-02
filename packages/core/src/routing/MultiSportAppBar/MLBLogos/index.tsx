import styled from 'styled-components';

import logo from './MLB.png';
import logoPA from './MLBPA.png';

const Root = styled.div`
  display: flex;
  gap: 20px;
  & img {
    height: 16px;
  }
`;

export const MLBPA = () => {
  return (
    <Root>
      <img src={logo} alt="MLB" />
      <img src={logoPA} alt="MLBPA" />
    </Root>
  );
};

export default MLBPA;
