import { MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

interface Props {
  name: MessageDescriptor;
  selected?: boolean | number;
}

const StyledText16 = styled(Text16)`
  text-align: left;
`;
const Count = styled.span`
  font-weight: 400;
  color: var(--c-neutral-600);
`;

export const FilterTitle = (props: Props) => {
  const { name, selected } = props;
  const { formatMessage } = useIntl();

  if (selected) {
    return (
      <StyledText16 bold>
        <span>{formatMessage(name)}&nbsp;</span>
        <Count>({typeof selected === 'boolean' ? 1 : selected})</Count>
      </StyledText16>
    );
  }

  return <StyledText16 bold>{formatMessage(name)}</StyledText16>;
};

export default FilterTitle;
