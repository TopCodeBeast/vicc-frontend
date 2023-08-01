import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CopyToClipboardButton from '@sorare/core/src/atoms/buttons/CopyToClipboardButton';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useEvents from '@sorare/core/src/lib/events/useEvents';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const FlexRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--half-unit);
`;
const CodeDigits = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
  gap: var(--unit);
  border-radius: var(--double-unit);
  font: var(--t-bold) var(--t-32);
  color: var(--c-neutral-1000);
  background-color: var(--c-neutral-300);
`;
const OpacityFilter = styled.span`
  opacity: 0.6;
  padding: var(--half-unit);
`;

type Props = { joinSecret: string; so5UserGroupId: string };
const ShareUserGroupWithCode = ({ joinSecret, so5UserGroupId }: Props) => {
  const track = useEvents();
  return (
    <Root>
      <FlexRowContainer>
        <FormattedMessage
          id="UserGroupDialog.Congrats.ShareUserGroupWithCode.withCode"
          defaultMessage="With a code"
        />
        <CopyToClipboardButton
          textToCopy={joinSecret}
          alignRight
          onClick={() =>
            track('Click Copy', {
              so5UserGroupId: idFromObject(so5UserGroupId),
              type: 'code',
            })
          }
        />
      </FlexRowContainer>

      <CodeDigits>
        {joinSecret.split('').map((digit, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <OpacityFilter key={index}>{digit}</OpacityFilter>
        ))}
      </CodeDigits>
    </Root>
  );
};

export default ShareUserGroupWithCode;
