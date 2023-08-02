import styled from 'styled-components';

export const TextContent = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

export const CardContainer = styled.div`
  width: 90px;
  transform: rotate(5deg);

  img {
    max-width: 100%;
  }
`;
