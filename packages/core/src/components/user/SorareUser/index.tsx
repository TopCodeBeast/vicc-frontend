import styled from 'styled-components';

import { Verified } from '@core/atoms/icons/Verified';

const Root = styled.div`
  color: var(--c-neutral-1000);
  display: flex;
  align-items: center;
  font: var(--t-12);
  font-weight: var(--t-bold);
  gap: var(--unit);
`;

const ViccUser = () => {
  return (
    <Root>
      <Verified /> Vicc
    </Root>
  );
};

export default ViccUser;
