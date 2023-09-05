import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title5 } from '@sorare/core/src/atoms/typography';

import { categoryLabels, splitScore, statLabels } from '@football/lib/scoring';

import { DetailedScoreV4V5_vicc5Score } from './__generated__/index.graphql';

type Props = {
  vicc5Score: DetailedScoreV4V5_vicc5Score;
  withDetails?: boolean;
};

const Root = styled.div`
  display: grid;
  gap: var(--double-unit);
`;
const Line = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.hoverable:hover:before {
    position: absolute;
    left: calc(var(--intermediate-unit) * -1);
    right: calc(var(--intermediate-unit) * -1);
    top: 0;
    bottom: 0;
    content: '';
    background-color: rgba(var(--c-rgb-neutral-400), 0.2);
  }
`;
const CapitalizedFirstLetter = styled.p`
  ::first-letter {
    text-transform: capitalize;
  }
`;
const Box = styled.div`
  display: grid;
  gap: var(--double-unit);
  width: 100%;
  border-radius: 8px;
  padding: var(--intermediate-unit);
  background-color: var(--c-neutral-300);
`;
const Category = styled.div`
  display: grid;
  gap: var(--unit);
  /* margin-top: var(--double-unit); */
`;

const DecisiveStats = ({
  positive,
  stats,
}: {
  positive?: boolean;
  stats: { stat: string; statValue: number }[];
}) => (
  <>
    {stats.map(a => (
      <Line
        key={a.stat}
        className={classnames({
          positive,
          negative: !positive,
        })}
      >
        <CapitalizedFirstLetter as={Text16}>
          <FormattedMessage
            {...statLabels[a.stat as keyof typeof statLabels]}
          />
        </CapitalizedFirstLetter>
        <Text16
          bold
          color={positive ? 'var(--c-green-600)' : 'var(--c-red-600)'}
        >
          {a.statValue}
        </Text16>
      </Line>
    ))}
  </>
);

export const DetailedScoreV4V5 = ({ vicc5Score, withDetails }: Props) => {
  const {
    position,
    decisiveScore,
    positiveDecisiveStats,
    negativeDecisiveStats,
    allAroundStats,
  } = vicc5Score;
  const { formatMessage } = useIntl();

  const formatScore = (value: number) =>
    value === 0 ? (
      '-'
    ) : (
      <FormattedNumber
        value={value}
        minimumFractionDigits={1}
        maximumFractionDigits={1}
      />
    );

  const displayCategory = (category: string) => {
    if (position !== 'Goalkeeper' && category === 'GOALKEEPING') return false;
    if (
      position === 'Goalkeeper' &&
      ['DEFENDING', 'ATTACKING'].includes(category)
    )
      return false;

    return true;
  };

  const { categoryScores } = splitScore(allAroundStats);

  const allAroundScore = allAroundStats.reduce(
    (sum, stat) => sum + stat.totalScore,
    0
  );

  return (
    <Root>
      <Box>
        <Line as={Title5}>
          <FormattedMessage
            id="DetailedScoresV4.decisiveScore"
            defaultMessage="Decisive score"
          />
          <div>{formatScore(decisiveScore?.totalScore || 0)}</div>
        </Line>
        <DecisiveStats positive stats={positiveDecisiveStats} />
        <DecisiveStats stats={negativeDecisiveStats} />
      </Box>
      {allAroundStats.length > 0 && (
        <Box>
          <Line as={Title5}>
            <FormattedMessage
              id="DetailedScoresV4.allAroundScore"
              defaultMessage="All around score"
            />
            <div>{formatScore(allAroundScore)}</div>
          </Line>
          {withDetails &&
            Object.keys(categoryScores)
              .filter(displayCategory)
              .map(category => (
                <Category key={category}>
                  <Line>
                    <CapitalizedFirstLetter as={Text16} bold>
                      <FormattedMessage
                        {...categoryLabels[
                          category as keyof typeof categoryLabels
                        ]}
                      />
                    </CapitalizedFirstLetter>
                  </Line>
                  {allAroundStats
                    .filter(stat => stat.category === category)
                    .sort(
                      (a, b) => Math.abs(b.totalScore) - Math.abs(a.totalScore)
                    )
                    .map(s => (
                      <Line className="hoverable" key={s.stat}>
                        <CapitalizedFirstLetter
                          as={Text14}
                          color="var(--c-neutral-600)"
                        >
                          {formatMessage(
                            statLabels[s.stat as keyof typeof statLabels]
                          )}
                          &nbsp;({s.statValue})
                        </CapitalizedFirstLetter>
                        <Text14>{formatScore(s.totalScore)}</Text14>
                      </Line>
                    ))}
                </Category>
              ))}
        </Box>
      )}
    </Root>
  );
};

DetailedScoreV4V5.fragments = {
  vicc5Score: gql`
    fragment DetailedScoreV4V5_vicc5Score on Vicc5Score {
      id
      position
      decisiveScore {
        totalScore
      }
      allAroundStats {
        stat
        category
        statValue
        totalScore
      }
      positiveDecisiveStats {
        stat
        statValue
      }
      negativeDecisiveStats {
        stat
        statValue
      }
    }
  ` as TypedDocumentNode<DetailedScoreV4V5_vicc5Score>,
};

export default DetailedScoreV4V5;
