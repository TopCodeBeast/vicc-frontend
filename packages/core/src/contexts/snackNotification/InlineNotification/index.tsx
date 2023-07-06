import { faClose } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { FullWidthContainer } from '@core/atoms/container';

import { Level } from '..';
import { Message } from '../SnackMessage';

const WhiteFullWidthContainer = styled(FullWidthContainer)`
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;

const Wrapper = styled.div`
  padding: var(--double-unit) 0;
  display: flex;
  gap: var(--double-unit);
  border-bottom: 1px solid var(--c-neutral-300);

  & > :last-child {
    margin-left: auto;
  }
`;

export const InlineNotification = ({
  notification,
  onClose,
}: {
  notification: ReactNode;
  onClose: () => void;
}) => {
  return (
    <WhiteFullWidthContainer>
      <Wrapper>
        <Message notification={notification} level={Level.INFO} />
        <IconButton
          aria-label="Close"
          color="white"
          onClick={onClose}
          icon={faClose}
        />
      </Wrapper>
    </WhiteFullWidthContainer>
  );
};
