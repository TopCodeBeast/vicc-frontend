import { ReactNode } from 'react';
import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'apercu-pro';
  padding: 0 calc(6 * var(--unit));
  text-align: center;
  @media ${tabletAndAbove} {
    flex: 5 1 0;
    padding: 0;
  }
`;

const HeadingWrapper = styled.h2`
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  margin: 0;
  color: white;
  margin-bottom: var(--double-unit);
  @media ${tabletAndAbove} {
    font-size: 60px;
    margin-bottom: var(--quadruple-unit);
  }
`;

const SubHeading = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  // color: var(--c-neutral-600);
  color: white;
  @media ${tabletAndAbove} {
    font-size: 18px;
  }
`;

type Props = {
  heading: ReactNode;
  subHeading: ReactNode;
};

export const SectionFullText = ({ heading, subHeading }: Props) => {
  return (
    <Wrapper>
      <HeadingWrapper data-testid="section-text">{heading}</HeadingWrapper>

      <SubHeading>{subHeading}</SubHeading>
    </Wrapper>
  );
};
