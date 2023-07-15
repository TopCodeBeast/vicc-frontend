import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: grid;
  grid-template-areas: 'title title' 'content gap';
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--background-color, var(--c-neutral-200));
`;
const StatusTitle = styled.div`
  grid-area: title;
`;
const StatusContent = styled.div`
  grid-area: content;
`;
const StatusGap = styled.div`
  grid-area: gap;
  display: flex;
  gap: var(--unit);
  justify-content: flex-end;
  align-items: center;
`;

export enum DifferenceType {
  increase,
  decrease,
}
type StatusProps = {
  title: ReactNode;
  value: ReactNode;
  difference?: ReactNode;
  differenceType?: DifferenceType;
};
const Status = ({ title, value, difference, differenceType }: StatusProps) => (
  <StatusContainer>
    <StatusTitle>{title}</StatusTitle>
    <StatusContent>{value}</StatusContent>
    <StatusGap>
      {differenceType === DifferenceType.increase && (
        <FontAwesomeIcon icon={faChevronUp} color="green" />
      )}
      {differenceType === DifferenceType.decrease && (
        <FontAwesomeIcon icon={faChevronDown} color="red" />
      )}
      {difference}
    </StatusGap>
  </StatusContainer>
);

export default Status;
