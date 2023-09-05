import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import {
  DrukWide24,
  DrukWide40,
  MarketingText20,
  Romie20,
} from '@sorare/core/src/components/marketing/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { steps } from './data';

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-and-a-half-unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: var(--quadruple-unit);
    grid-row-gap: var(--quadruple-unit);
  }
`;

const Subtitle = styled(Text16)`
  text-transform: uppercase;
`;

const Earn = styled.div`
  display: flex;
  grid-column: 3/4;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: var(--c-static-neutral-300);
  padding: var(--double-unit);
  gap: calc(3 * var(--double-and-a-half-unit));
  height: 100%;

  @media ${tabletAndAbove} {
    padding: var(--triple-unit);
  }
`;

type Step = {
  name: string;
  title: ReactNode;
  subtitle: ReactNode;
};

const Step = ({ step: { title, subtitle, name } }: { step: Step }) => (
  <Item>
    <DrukWide40>{name}</DrukWide40>
    <div>
      <Romie20>{title}</Romie20>
      <Text16 color="var(--c-static-neutral-600)">{subtitle}</Text16>
    </div>
  </Item>
);

export const Steps = () => {
  return (
    <Grid>
      <div>
        <DrukWide24 color="var(--c-pink-600)">
          <FormattedMessage
            id="affiliateProgram.steps.title"
            defaultMessage="How it works"
          />
        </DrukWide24>
        <Subtitle>Vicc</Subtitle>
      </div>
      <Earn>
        <MarketingText20>
          <FormattedMessage
            id="affiliateProgram.steps.helper"
            defaultMessage="Earn up to 10% commissions by promoting Vicc"
          />
        </MarketingText20>
      </Earn>
      {steps.map(step => (
        <Step key={step.name} step={step} />
      ))}
    </Grid>
  );
};

export default Steps;
