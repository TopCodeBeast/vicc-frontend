import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { CAPTAIN, fantasy } from '@sorare/core/src/lib/glossary';

interface Props {
  active?: boolean;
}

const Wrapper = styled.div<Props>`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.active ? 'var(--c-yellow-600)' : 'white'};
  box-shadow: -6px 12px 20px rgba(0, 0, 0, 0.3);
  width: var(--size, 32px);
  height: var(--size, 32px);
  font-size: calc(var(--size, 32px) * 3 / 5);
  font-weight: bold;
  line-height: 1;
  color: var(--c-static-neutral-1000);
`;

export const Captain = (props: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Wrapper {...props} title={formatMessage(fantasy.captain)}>
      {CAPTAIN}
    </Wrapper>
  );
};

export default Captain;
