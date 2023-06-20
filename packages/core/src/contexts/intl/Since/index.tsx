import { parseISO } from 'date-fns';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';

import { useIntlContext } from '..';

export type Props = {
  date: ISO8601DateTime;
};

const Root = styled(Caption)`
  white-space: nowrap;
`;

export const Since = ({ date }: Props) => {
  const { formatDistanceToNow } = useIntlContext();

  return (
    <Root color="var(--c-neutral-600)">
      {formatDistanceToNow(parseISO(date))}
    </Root>
  );
};

export default Since;
