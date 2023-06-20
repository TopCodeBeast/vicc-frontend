import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { glossary } from '@sorare/core/src/lib/glossary';

const DefaultSup = styled.sup`
  font-size: inherit;
`;

type Props = {
  rank?: number | null;
  Sup?: React.ElementType<any>;
};

export const Rank = ({ rank, Sup = DefaultSup }: Props) => {
  return typeof rank === 'number' ? (
    <FormattedMessage
      {...glossary.ordinalStyled}
      values={{ ordinal: rank, sup: (c: string) => <Sup>{c}</Sup> }}
    />
  ) : null;
};
