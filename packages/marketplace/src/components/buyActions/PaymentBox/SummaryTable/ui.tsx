import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  padding: var(--double-unit) 0;
  &:not(:first-child) {
    border-top: solid 1px var(--c-neutral-400);
  }
`;

export const AccountingLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: var(--double-unit);
`;
