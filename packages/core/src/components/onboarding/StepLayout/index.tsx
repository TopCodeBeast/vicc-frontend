import styled from 'styled-components';

import { Container } from '@core/atoms/container';
import { tabletAndAbove } from '@core/style/mediaQuery';

export const StepLayout = styled(Container)`
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  justify-items: center;
  margin: 0;
  position: relative;
  /* Fix safari layout issue with transform */
  overflow-x: hidden;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    padding: var(--double-unit) 0;
    gap: var(--double-unit);
  }
`;
