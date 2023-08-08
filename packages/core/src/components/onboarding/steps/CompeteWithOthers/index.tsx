import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text14 } from '@core/atoms/typography';
import { StepLayout } from '@core/components/onboarding/StepLayout';
import { OnboardingTitle } from '@core/components/onboarding/Title';
import { StepProps } from '@core/components/onboarding/types';
import { tabletAndAbove } from '@core/style/mediaQuery';

const Title = styled.div`
  text-align: center;
`;

export const CompetitionTable = styled.table`
  width: min(100%, 650px);
  margin: auto;
  text-align: left;
  border-spacing: 0;
  border-collapse: collapse;
  tbody > tr:first-of-type > td {
    background: white;
    &:first-child {
      border-top-left-radius: var(--unit);
      border-bottom-left-radius: var(--unit);
    }
    &:last-child {
      border-top-right-radius: var(--unit);
      border-bottom-right-radius: var(--unit);
    }
  }
`;

export const Row = styled.tr`
  align-items: center;
  &:nth-of-type(2) {
    opacity: 0.5;
  }
  &:nth-of-type(3) {
    opacity: 0.3;
  }
  &:nth-of-type(4) {
    opacity: 0.1;
  }
  & > th,
  & > td {
    padding: var(--unit);
    margin: 0;
    @media ${tabletAndAbove} {
      padding: var(--double-unit);
    }
  }
`;

export const Header = styled(Row)`
  color: var(--c-neutral-600);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const RulesLink = styled.div`
  font: var(--t-12);
  padding: 0 calc(10 * var(--unit));
`;

export const Img = styled.img`
  max-width: calc(5 * var(--unit));
  max-height: calc(5 * var(--unit));
`;

export const Competition = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

export const Participants = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const Subtitle = styled(Text14)`
  font-weight: var(--t-bold);
`;

type Props = StepProps & { children: ReactNode; rulesLink: ReactNode };

const CompeteWithOthers = ({ children, rulesLink, nextStep }: Props) => {
  return (
    <StepLayout>
      <Title>
        <OnboardingTitle>
          <FormattedMessage
            id="CompeteWithOthers.title"
            defaultMessage="Compete with others"
          />
        </OnboardingTitle>
        <Subtitle>
          <FormattedMessage
            id="CompeteWithOthers.instructions1"
            defaultMessage="Enter tournaments with your Cards."
          />
        </Subtitle>
        <Subtitle>
          <FormattedMessage
            id="CompeteWithOthers.instructions2"
            defaultMessage="The better your players perform, the higher your score!"
          />
        </Subtitle>
      </Title>
      {children}
      <Action>
        <Button color="blue" onClick={nextStep}>
          <FormattedMessage
            id="CompeteWithOthers.cta"
            defaultMessage="Enter tournament"
          />
        </Button>
        <RulesLink>{rulesLink}</RulesLink>
      </Action>
    </StepLayout>
  );
};

export default CompeteWithOthers;
