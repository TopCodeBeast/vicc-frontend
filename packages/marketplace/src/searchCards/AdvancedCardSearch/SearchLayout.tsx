import { createRef, useMemo } from 'react';
import styled from 'styled-components';

import { Props } from './types';

const Root = styled.div`
  gap: var(--triple-unit);
  display: flex;
  flex-direction: column;
`;
export const SearchLayout = (props: Props) => {
  const ref = useMemo(() => createRef<HTMLDivElement>(), []);
  
  return (
    <Root ref={ref}>
      <>SearchLayout</>
    </Root>
  );
};

export default SearchLayout;
