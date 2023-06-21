import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { theme } from '@core/style/theme';

export const LineupActionCta = styled(Button).attrs({
  medium: true,
})`
  @media (min-width: ${theme.breakpoints.values.mobile}px) {
    width: auto;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    width: auto;
    max-width: 100%;
  }
`;
