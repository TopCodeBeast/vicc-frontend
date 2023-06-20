import styled from 'styled-components';

import MetalabButton from '@sorare/core/src/atoms/buttons/MetalabButton';

interface HeaderProps {
  onClose?: () => void;
  onBack?: () => void;
}

const HeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--double-unit);
  position: absolute;
  top: 0;
  width: 100%;
`;

const Header = ({ onClose, onBack }: HeaderProps) => {
  return (
    <HeaderDiv>
      <div>{onBack && <MetalabButton icon="back" onClick={onBack} />}</div>
      <div>{onClose && <MetalabButton icon="close" onClick={onClose} />}</div>
    </HeaderDiv>
  );
};

export default Header;
