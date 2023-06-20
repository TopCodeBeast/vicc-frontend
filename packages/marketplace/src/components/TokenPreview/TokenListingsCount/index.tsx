import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { StackedCards } from '@sorare/core/src/atoms/icons/StackedCards';

const Root = styled.span`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const TokenListingsCount = ({ count }: { count: number }) => {
  return (
    <Root>
      <StackedCards />
      <FormattedMessage
        id="tokenPreview.listingsCount"
        defaultMessage="{count} {count, plural, one {listing} other {listings}}"
        values={{ count }}
      />
    </Root>
  );
};

export default TokenListingsCount;
