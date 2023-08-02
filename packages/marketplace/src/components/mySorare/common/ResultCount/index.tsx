import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';

const Root = styled.div`
  margin-bottom: 20px;
`;

const ResultCount = ({ count }: { count: number }) => {
  return (
    <Root>
      <Title6>
        <FormattedMessage
          id="ResultCount.count"
          defaultMessage="{count, plural, one {# Result found} other {# Results found}}"
          values={{ count }}
        />
      </Title6>
    </Root>
  );
};

export default ResultCount;
