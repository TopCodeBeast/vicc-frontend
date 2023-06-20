import { ReactElement } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';

interface Props {
  title: MessageDescriptor;
  description?: MessageDescriptor | null;
  content?: ReactElement;
}

const Root = styled.div`
  text-align: left;
  color: var(--c-neutral-100);
`;
export const TooltipContent = (props: Props) => {
  const { title, description, content } = props;

  return (
    <Root>
      <Caption bold>
        <FormattedMessage {...title} />
      </Caption>
      {description && (
        <Caption color="var(--c-neutral-600)">
          <FormattedMessage {...description} />
        </Caption>
      )}
      {content}
    </Root>
  );
};

export default TooltipContent;
