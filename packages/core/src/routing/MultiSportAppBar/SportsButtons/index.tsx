import { ButtonBase } from '@material-ui/core';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { ChevronRightBold } from '@core/atoms/icons/ChevronRightBold';

import { sportLogos } from '../Sport/Switch';

const SportButton = styled(ButtonBase)`
  display: inline-flex;
  width: 100%;
  padding: var(--triple-unit) 0;
  justify-content: space-between;
  color: var(--c-neutral-100);
  border-bottom: 1px solid;
  border-bottom-color: #2b2d33;
`;

const Logo = styled.span`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const SportsButtons = ({
  currentNavSport,
  onClick,
}: {
  currentNavSport: Sport | undefined;
  onClick: (sport: Sport) => void;
}) => {
  return (
    <>
      {Object.entries(sportLogos)
        .filter(([compSport]) => currentNavSport !== compSport)
        .map(([compSport, Comp]) => {
          return (
            <SportButton
              onClick={() => onClick(compSport as Sport)}
              key={compSport}
            >
              <Logo>
                <Comp active />
              </Logo>
              <ChevronRightBold />
            </SportButton>
          );
        })}
    </>
  );
};

export default SportsButtons;
