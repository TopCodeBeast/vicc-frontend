import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { mobileAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

export const LineupActionCta = styled(Button).attrs({
  medium: true,
})`
  @media ${mobileAndAbove} {
    width: auto;
  }

  @media ${tabletAndAbove} {
    width: auto;
    max-width: 100%;
  }
`;
