import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title2 } from '@core/atoms/typography';
import { tabletAndAbove } from '@core/style/mediaQuery';

export const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  margin: calc(5 * var(--unit)) 0 var(--double-unit) 0;
  @media ${tabletAndAbove} {
    margin: calc(10 * var(--unit)) 0 var(--quadruple-unit) 0;
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
  font: var(--t-16);
  gap: var(--half-unit);
`;

type Props = {
  title: ReactNode | string;
  subtitle?: ReactNode | string;
};
export const Header = ({ title, subtitle }: Props) => {
  return (
    <Wrapper>
      <OverTitle>
        <FormattedMessage
          id="CardDrop.Header.abovetitle"
          defaultMessage="Daily drop"
        />
      </OverTitle>
      <OnboardingTitle>{title}</OnboardingTitle>
      {subtitle && <OnboardingSubtitle>{subtitle}</OnboardingSubtitle>}
    </Wrapper>
  );
};
