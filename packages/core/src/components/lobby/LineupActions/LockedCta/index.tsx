import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Locker } from '@core/atoms/icons/Locker';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';
import { tabletAndAbove } from '@core/style/mediaQuery';

const ButtonLabel = styled.span`
  margin-left: var(--unit);
  display: none;
`;

const ButtonWithHiddenLabel = styled(Button)`
  min-width: 100px !important;

  @media ${tabletAndAbove} {
    width: auto;
    ${ButtonLabel} {
      display: block;
    }
  }
`;

type Props = {
  value: boolean;
  reason: string | null;
};

export const LockedCta = ({ value, reason }: Props) => {
  if (value) return null;

  return (
    <Tooltip
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      title={<Text14>{reason}</Text14>}
      placement="top"
    >
      <ButtonWithHiddenLabel fullWidth disabled color="gray" medium>
        <Locker />
        <ButtonLabel>
          <FormattedMessage
            id="LobbyCompetitionListCta.Locked"
            defaultMessage="Locked"
          />
        </ButtonLabel>
      </ButtonWithHiddenLabel>
    </Tooltip>
  );
};
