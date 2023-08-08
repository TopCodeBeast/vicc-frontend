import styled from 'styled-components';

export const FullScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: var(--100vh);
  display: flex;
  background: white;
  isolation: isolate;
  z-index: 2;
  overflow: auto;
  & > * {
    flex: 1;
  }
`;
