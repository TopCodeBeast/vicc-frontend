import { createRef, useMemo } from 'react';
import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

import { Props } from './types';

const Root = styled.div`
  gap: var(--triple-unit);
  display: flex;
  flex-direction: column;
`;
const Heading = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
`;

const TitleContainer = styled.div`
  display: inline;
  & > *:not(:last-child) {
    display: inline;
    margin-right: var(--unit);
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--unit);
    & > *:not(:last-child) {
      display: inline-flex;
      margin-right: 0;
    }
  }
`;

export const SearchLayout = (props: Props) => {
  const {
    title,
    subtitle,
  } = props;

  console.log('title~~~~~~~~~~~', title);
  const ref = useMemo(() => createRef<HTMLDivElement>(), []);
  
  return (
    <Root ref={ref}>
      {(title || subtitle) && (
        <Heading>
          {title && (
            <TitleContainer>
              {title}
            </TitleContainer>
          )}
          {subtitle}
        </Heading>
      )}
      <>SearchLayout2</>
    </Root>
  );
};

export default SearchLayout;
