import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { Rank } from '@sorare/core/src/components/lobby/Rank';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

type Props = {
  title: string;
  rank: number;
  points: number;
  gameWeek: number;
};
const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: calc(3 * var(--unit));
  gap: calc(3 * var(--unit));
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const Stats = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  --gap: var(--unit);
  --separator-size: 1px;
  gap: calc(var(--gap) + var(--separator-size));
`;
const Stat = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  & span {
    color: var(--c-neutral-600);
    text-transform: uppercase;
    font-size: 12px;
  }
  &:nth-child(n + 2)::before {
    position: absolute;
    content: '';
    left: calc(var(--gap) / -2);
    top: 30%;
    bottom: 20%;
    width: var(--separator-size);
    background: var(--c-neutral-600);
  }
  & sup {
    font-weight: normal;
  }
`;
export const RewardHeader = ({ title, rank, points, gameWeek }: Props) => {
  const { formatNumber } = useIntlContext();

  return (
    <Root>
      <Title2>{title}</Title2>
      <Stats>
        <Stat>
          <span>
            <FormattedMessage id="RewardHeader.Rank" defaultMessage="Rank" />
          </span>
          <strong>
            <Rank rank={rank} Sup={({ children }) => <sup>{children}</sup>} />
          </strong>
        </Stat>
        <Stat>
          <span>
            <FormattedMessage
              id="RewardHeader.Points"
              defaultMessage="Points"
            />
          </span>
          <strong>{formatNumber(points, { maximumFractionDigits: 2 })}</strong>
        </Stat>
        <Stat>
          <span>
            <FormattedMessage
              id="RewardHeader.Gameweek"
              defaultMessage="Game Week"
            />
          </span>
          <strong>{gameWeek}</strong>
        </Stat>
      </Stats>
    </Root>
  );
};
