import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Icon = styled.div`
  position: relative;
  z-index: 0;
  color: white;
  font-size: 11;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::after {
    content: '';
    background-color: var(--c-red-600);
    inset: 0;
    margin: 3px;
    border-radius: 2px;
    z-index: -1;
    position: absolute;
    transform: rotateZ(45deg);
  }
`;

type Props = {
  title?: string;
  className?: string;
};

export const Ineligible = ({ title, className }: Props) => {
  return (
    <Icon className={className}>
      <FontAwesomeIcon icon={faTimes} title={title} />
    </Icon>
  );
};
