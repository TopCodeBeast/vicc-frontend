import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { theme } from '@sorare/core/src/style/theme';

import { positionShortNames } from '@football/lib/so5';

const Wrapper = styled.div`
  display: flex;
  gap: var(--half-unit);
  flex: 1;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex: none;
  }
`;

const StyledButton = styled(Button)`
  && {
    min-width: unset;
    padding: 0 var(--half-unit);
    flex: 1;
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      padding: 0 var(--intermediate-unit);
    }
  }
`;

type Props = {
  positions: Position[];
  currentPosition?: Position;
  onClick: (position: Position) => void;
};

export const PositionTabs = ({
  positions,
  currentPosition,
  onClick,
}: Props) => {
  return (
    <Wrapper>
      {positions.map(position => {
        const isSelected = currentPosition === position;
        return (
          <StyledButton
            key={position}
            onClick={() => onClick(position)}
            small
            color={isSelected ? 'darkGray' : 'gray'}
          >
            <FormattedMessage {...positionShortNames[position]} />
          </StyledButton>
        );
      })}
    </Wrapper>
  );
};

export default PositionTabs;
