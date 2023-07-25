import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Switch from '@sorare/core/src/components/search/Switch';
import { filters } from '@sorare/core/src/lib/glossary';

const Root = styled.div`
  padding: var(--intermediate-unit) 0;
`;

type Props = { onChange: (startedOnly: boolean) => void; startedOnly: boolean };

export const StartedOnlyFilter = ({ onChange, startedOnly }: Props) => {
  return (
    <Root>
      <Switch
        checked={startedOnly}
        onChange={event => onChange(event.target.checked)}
        label={
          <Text16 bold>
            <FormattedMessage {...filters.startedOnlyFilterLabel} />
          </Text16>
        }
      />
    </Root>
  );
};
