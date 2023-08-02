import { faExclamation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--triple-unit);
  height: var(--triple-unit);
  background-color: var(--c-yellow-600);
  border-radius: 100%;
  border: 3px solid var(--c-neutral-200);
`;

const Icon = styled(FontAwesomeIcon).attrs({ icon: faExclamation, size: 'sm' })`
  color: var(--c-static-neutral-1000);
`;

export const ExclamationIcon = ({ className }: { className?: string }) => {
  return (
    <Wrapper className={className}>
      <Icon />
    </Wrapper>
  );
};
