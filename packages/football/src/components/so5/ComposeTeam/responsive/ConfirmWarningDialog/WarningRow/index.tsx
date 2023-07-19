import { ReactNode } from 'react';
import styled from 'styled-components';

import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';
import { format } from '@sorare/core/src/lib/seasons';

import { ContextProvider_card } from '@football/components/so5/ComposeTeam/ContextProvider/__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  background: var(--c-neutral-300);
  padding: var(--intermediate-unit);
  border-radius: var(--intermediate-unit);
`;
const PlayerInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--intermediate-unit);
`;

const Warning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  padding: var(--unit) var(--intermediate-unit);
  background: rgba(var(--c-rgb-neutral-1000), 0.1);
  border-radius: var(--unit);
  border: 1px solid var(--c-neutral-400);
  &.error {
    background: rgba(var(--c-rgb-red-600), 0.1);
    border: 1px solid var(--c-red-600);
  }
`;

const PlayerImg = styled(CardImg)`
  width: 40px;
`;

type Props = {
  card: ContextProvider_card;
  warning: ReactNode;
  warningLevel?: 'error' | 'warning';
};

export const WarningRow = ({
  card,
  warning,
  warningLevel = 'warning',
}: Props) => {
  const { pictureUrl, season, singleCivilYear } = card;

  return (
    <Wrapper>
      <PlayerInfo>
        {pictureUrl && <PlayerImg src={pictureUrl} alt="" width={40} />}
        <div>
          <Text16>{card.player.displayName}</Text16>
          <Caption color="var(--c-neutral-600)">
            {`${format(season, {
              singleCivilYear,
            })} - ${getHumanReadableSerialNumber(card)}`}
          </Caption>
        </div>
      </PlayerInfo>
      <Warning className={warningLevel}>{warning}</Warning>
    </Wrapper>
  );
};
