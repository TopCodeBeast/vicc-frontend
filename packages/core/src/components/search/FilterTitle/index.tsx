import { MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';

interface Props {
  name: MessageDescriptor;
  selected?: boolean | number;
}

const Count = styled.span`
  font-weight: 400;
  color: var(--c-neutral-600);
`;

export const FilterTitle = (props: Props) => {
  const { name, selected } = props;
  const { formatMessage } = useIntl();

  if (selected) {
    return (
      <Text16 bold>
        <span>{formatMessage(name)}&nbsp;</span>
        <Count>({typeof selected === 'boolean' ? 1 : selected})</Count>
      </Text16>
    );
  }

  return <Text16 bold>{formatMessage(name)}</Text16>;
};

export default FilterTitle;
