import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  border: 1px dashed var(--c-neutral-400);
`;

type Props = { query: string };

export const NoResults = ({ query }: Props) => {
  if (query) {
    return (
      <Root>
        <Text16 bold>
          <FormattedMessage
            id="Collections.NoResults.query.title"
            defaultMessage='Could not find "{query}"'
            values={{ query }}
          />
        </Text16>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="Collections.NoResults.query.description"
            defaultMessage="Try searching again using different spelling"
          />
        </Text16>
      </Root>
    );
  }

  return (
    <Root>
      <Text16 bold>
        <FormattedMessage
          id="Collections.NoResults.default.title"
          defaultMessage="Could not find any collection"
        />
      </Text16>
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage
          id="Collections.NoResults.default.description"
          defaultMessage="Cards that you buy on the market are automatically added to your collections"
        />
      </Text16>
    </Root>
  );
};
