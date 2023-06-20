import { defineMessage } from 'react-intl';
import styled from 'styled-components';

import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { theme } from '@sorare/core/src/style/theme';

import commonCardNBA from '../../../CollectBlock/assets/nba/common.png';
import limitedCardNBA from '../../../CollectBlock/assets/nba/limited.png';
import rareCardNBA from '../../../CollectBlock/assets/nba/rare.png';
import superRareCardNBA from '../../../CollectBlock/assets/nba/super-rare.png';
import uniqueCardNBA from '../../../CollectBlock/assets/nba/unique.png';
import ScoreTag from '../ScoreTag';

const CaptainTag = styled.span`
  --captainTagSize: 16px;
  position: absolute;
  left: calc(-0.5 * var(--captainTagSize, 16px));
  top: calc(-0.5 * var(--captainTagSize, 16px));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: var(--captainTagSize);
  width: var(--captainTagSize);
  font-weight: 900;
  font-size: calc(0.7 * var(--captainTagSize, 16px));
  text-align: center;
  background-color: #ffc700;
  color: var(--c-neutral-1000);
`;

const PlayerFixtureScore = styled.div`
  position: absolute;
  --halfScoreTagMin: calc(0.5 * var(--scoreTagMin, 20px));
  --halfScoreTagMax: calc(0.5 * var(--scoreTagMax, 30px));
  left: calc(50% - var(--halfScoreTagMin));
  bottom: -10px;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    left: calc(50% - var(--halfScoreTagMax));
    bottom: -15px;
  }
`;

const PlayerName = styled.div`
  font-size: 10px;
  line-height: 150%;
  letter-spacing: -0.01em;
  white-space: nowrap;
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  bottom: calc(-1 * var(--scoreTagMin, 20px) - 5px);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    bottom: calc(-1 * var(--scoreTagMax, 30px) - 5px);
  }
`;

const playerName = defineMessage({
  id: 'Landing.ComposeBlock.playerNum',
  defaultMessage: 'Player {num}',
});
type ThemeProps = {
  theme: {
    scarcity: 'common' | 'mix' | 'limited' | 'rare' | 'superRare' | 'unique';
    isCaptain: boolean;
    nba?: boolean;
  };
};

const colors: Record<string, string> = {
  common: '#D1DCDF',
  limited: '#DFAD46',
  rare: '#F2412D',
  superRare: '#6B49DB',
  superRareMlb: '#01C5FB',
  unique: '#4D4B49',
};

const nbaCards: Record<string, string> = {
  common: commonCardNBA,
  limited: limitedCardNBA,
  rare: rareCardNBA,
  superRareMlb: superRareCardNBA,
  unique: uniqueCardNBA,
};

const Wrapper = styled.div`
  position: relative;
  width: 60px;
  height: 80px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.19);

  ${({ theme: { scarcity, nba } }: ThemeProps) =>
    nba
      ? `
      background-image: url(${nbaCards[scarcity]});
      background-position: center 40%;
      border: 2px solid ${colors[scarcity]};`
      : `
      background: ${theme.mlColors.scarcity[scarcity]};
      `};
  ${({ theme: { isCaptain } }: ThemeProps) =>
    isCaptain ? `border: 2px solid #ffc700` : ''};

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    height: 74px;
    width: 65px;
    border-radius: 7px;
  }
`;

type Props = {
  visible: boolean;
  number: number;
  score: number;
  scarcity: string;
  isCaptain?: boolean;
  nba?: boolean;
};

const FieldPlayer = ({
  visible,
  number,
  score,
  scarcity,
  isCaptain = false,
  nba = false,
}: Props) => {
  const { formatMessage } = useIntlContext();
  return (
    <Wrapper
      theme={{
        scarcity,
        isCaptain,
        nba,
      }}
    >
      {isCaptain && (
        <CaptainTag>
          {formatMessage({
            id: 'Landing.ComposeBlock.captainTag',
            defaultMessage: 'C',
          })}
        </CaptainTag>
      )}
      <PlayerFixtureScore>
        <ScoreTag visible={visible} toValue={score} />
      </PlayerFixtureScore>
      <PlayerName>{formatMessage(playerName, { num: number })}</PlayerName>
    </Wrapper>
  );
};

export default FieldPlayer;
