import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Locker } from '@core/atoms/icons/Locker';

import { LineupActionCta } from '../LineupActionCta';

const CtaMessage = styled.span`
  margin-left: var(--unit);
`;

type Props = {
  onClick: () => void;
};

export const UnlockCta = ({ onClick }: Props) => {
  return (
    <LineupActionCta color="white" medium onClick={onClick}>
      <Locker />
      <CtaMessage>
        <FormattedMessage
          id="Lobby.LineupActions.Unlock.Cta"
          defaultMessage="Unlock"
        />
      </CtaMessage>
    </LineupActionCta>
  );
};
