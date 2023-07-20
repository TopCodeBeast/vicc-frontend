import { gql } from '@apollo/client';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { statLabels } from '@football/lib/scoring';

import DetailedScoreV4V5 from './DetailedScoreV4V5';
import { DetailedScore_so5Score } from './__generated__/index.graphql';

type Props = {
  so5Score: DetailedScore_so5Score;
  dark?: boolean;
  withDetails?: boolean;
};

const colors = ['green1', 'green2', 'red1', 'red2'] as const;
type Color = (typeof colors)[number];

const color = (points: number): Color | undefined => {
  if (points >= 20) return 'green1';
  if (points >= 10) return 'green2';
  if (points <= -15) return 'red1';
  if (points <= -10) return 'red2';

  return undefined;
};

const Root = styled.div`
  width: 100%;
  &.dark {
    color: white;
  }
`;
const Table = styled.table`
  font-size: 15px;
  & td {
    white-space: nowrap;
    text-align: right;
    &:first-child {
      text-align: left;
      color: var(--c-neutral-600);
    }
    &:not(:first-child) {
      font-variant-numeric: tabular-nums;
    }
    &:last-child {
      font-weight: bold;
    }
  }
`;
const Score = styled.td`
  &.green1 {
    color: var(--c-green-600);
  }
  &.green2 {
    color: #98c02a;
  }
  &.red1 {
    color: var(--c-red-600);
  }
  &.red2 {
    color: #ff6666;
  }
`;

export const DetailedScore = ({ so5Score, dark, withDetails }: Props) => {
  const { formatMessage, formatNumber } = useIntl();

  if (so5Score.scoringVersion === 4 || so5Score.scoringVersion === 5)
    return <DetailedScoreV4V5 so5Score={so5Score} withDetails={withDetails} />;

  const lines = so5Score.detailedScore.filter(
    s => s.totalScore !== 0 && s.stat !== 'starting_score'
  );

  return (
    <Root className={classnames({ dark })}>
      <Table>
        <colgroup>
          <col span={1} />
          <col span={1} width="50px" />
          <col span={1} width="60px" />
        </colgroup>
        <tbody>
          {lines.map(s => (
            <tr key={s.stat}>
              <td>
                {s.stat in statLabels
                  ? formatMessage(statLabels[s.stat as keyof typeof statLabels])
                  : s.stat}
              </td>
              <td>{s.statValue}</td>
              <Score className={classnames(color(s.totalScore))}>
                {formatNumber(s.totalScore, {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
                })}
              </Score>
            </tr>
          ))}
        </tbody>
      </Table>
    </Root>
  );
};

DetailedScore.fragments = {
  so5Score: gql`
    fragment DetailedScore_so5Score on Vicc5Score {
      id
      scoringVersion
      detailedScore {
        stat
        statValue
        totalScore
      }
      ...DetailedScoreV4V5_so5Score
    }
    ${DetailedScoreV4V5.fragments.so5Score}
  `,
};

export default DetailedScore;
