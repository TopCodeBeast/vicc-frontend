import { useKey } from 'react-use';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BackdropWrapper = styled.div`
  position: fixed;
  /* above dialogs */
  z-index: 1500;
  inset: 0;
  background: rgba(var(--c-static-rgb-neutral-1000), 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

type Props = {
  onClick?: () => void;
};
const Backdrop = ({ onClick }: Props) => {
  useKey('Escape', onClick);
  return <BackdropWrapper onClick={onClick} as={onClick ? 'button' : 'div'} />;
};

export default Backdrop;
