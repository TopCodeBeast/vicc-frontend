import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

export const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-end;
  margin: var(--double-unit) 0;
  @media ${tabletAndAbove} {
    margin: var(--quadruple-unit) 0;
  }
`;

const OverTitle = styled.h1`
  font: var(--t-12);
  font-weight: var(--t-bold);
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  position: relative;
`;

const OnboardingTitle = styled(Title2)`
  margin-bottom: var(--double-unit);
`;

const OnboardingSubtitle = styled.h3`
  align-items: center;
  font: var(--t-14);
  gap: var(--half-unit);
  margin: 0 var(--quadruple-unit);
  width: 100%;

  @media ${tabletAndAbove} {
    margin: 0 calc(12 * var(--unit));
  }
`;

type Props = {
  title: ReactNode | string;
  subtitle?: ReactNode | string;
};
export const Header = ({ title, subtitle = '' }: Props) => {
  return (
    <Wrapper>
      <OverTitle>
        <FormattedMessage
          id="StarterBundle.Header.feature"
          defaultMessage="Starter pack"
        />
      </OverTitle>
      <OnboardingTitle>{title}</OnboardingTitle>
      <OnboardingSubtitle>{subtitle}</OnboardingSubtitle>
    </Wrapper>
  );
};
