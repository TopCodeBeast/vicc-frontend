import { FC } from 'react';
import { FormattedNumber } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16 } from '@core/atoms/typography';

import { Rank } from '../Rank';

type Props = {
  rank?: number | null;
  total: number;
};

const Root = styled.div`
  display: flex;
  align-items: baseline;
`;

const Span: FC = props => <span {...props} />;

export const FormattedRank = ({ rank, total }: Props) => {
  if (typeof rank !== 'number') return null;

  return (
    <Root>
      <Text16 bold>
        <Rank rank={rank} Sup={Span} />
      </Text16>
      <Text14 color="var(--c-neutral-600)">
        {' / '}
        <FormattedNumber value={total} />
      </Text14>
    </Root>
  );
};
