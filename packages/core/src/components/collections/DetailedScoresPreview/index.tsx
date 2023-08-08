import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import {
  DetailedScoreKey,
  detailedScores,
} from '@core/components/collections/DetailedScoreLine';
import { ExclamationIcon } from '@core/components/collections/DetailedScoreLine/ExclamationIcon';
import { Image } from '@core/components/collections/DetailedScoreLine/Image';
import { Score } from '@core/components/collections/Score';
import { inGroups } from '@core/lib/arrays';

const Wrapper = styled.div`
  --item-width: calc(14 * var(--unit));
  --item-border: 1px solid var(--c-neutral-400);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  max-width: calc(3 * var(--item-width) + 2px);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.span`
  font: var(--t-bold) var(--t-14-16);
  color: var(--c-neutral-600);
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  padding: var(--unit) 0 var(--unit);
  min-width: var(--item-width);
`;

const Cols = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  ${Cell} + ${Cell} {
    border-inline-start: var(--item-border);
  }
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${Cols} + ${Cols} {
    border-block-start: var(--item-border);
  }
`;

const Warning = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
  padding: var(--unit) 0;
  border-block-start: var(--item-border);
  b {
    color: var(--c-yellow-800);
  }
  p {
    flex: 1 1 0%;
    line-height: 1;
  }
`;

type ItemProps = {
  img: string;
  label: ReactNode;
  value: number;
  listed?: boolean;
};

const Item = ({ img, label, value, listed }: ItemProps) => {
  return (
    <Cell>
      <Image img={img} listed={listed} />
      <Content>
        <Label>{label}</Label>
        <Score score={value} />
      </Content>
    </Cell>
  );
};

type Props = {
  scoreKeys?: DetailedScoreKey[];
  listed?: boolean;
};

export const DetailedScoresPreview = ({ scoreKeys, listed }: Props) => {
  const keys = scoreKeys ?? (Object.keys(detailedScores) as DetailedScoreKey[]);
  const cols = keys.length === 4 ? 2 : 3;
  const rows = inGroups(keys, cols);
  return (
    <Wrapper>
      <Rows>
        {rows.map(row => (
          <Cols key={row.join()}>
            {row.map(key => (
              <Item key={key} {...detailedScores[key]} listed={listed} />
            ))}
          </Cols>
        ))}
      </Rows>
      {listed && (
        <Warning>
          <ExclamationIcon />
          <Text14 bold>
            <FormattedMessage
              id="Collections.DetailsScoresPreview.Warning"
              defaultMessage="Cards <b>listed on the Market or included in trade offers</b> will not receive a Collection Score"
              values={{ b: Bold }}
            />
          </Text14>
        </Warning>
      )}
    </Wrapper>
  );
};
