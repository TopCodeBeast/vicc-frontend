import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import Dialog from '@core/components/dialog';
import { Reward } from '@core/components/rewards/types';
import { laptopAndAbove } from '@core/style/mediaQuery';

import { ClaimRewards } from '../ClaimRewards';

const FullSize = styled.div`
  height: 100%;
  @media ${laptopAndAbove} {
    height: calc(100vh - 4 * var(--unit));
  }
`;

const Actions = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
`;

type Props = {
  rewards: Reward[];
  open: boolean;
  onClaim: (id: string[]) => void;
  toggleShowClaimReward: () => void;
};

export const ClaimRewardsDialog = ({
  open,
  rewards,
  toggleShowClaimReward,
  onClaim,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={open}
      onClose={toggleShowClaimReward}
      fullWidth
      maxWidth={false}
    >
      <>
        <FullSize>
          <ClaimRewards rewards={rewards} onClaim={onClaim} />
        </FullSize>
        <Actions>
          <IconButton
            onClick={toggleShowClaimReward}
            color="white"
            icon={faTimes}
            title={formatMessage({
              id: 'ClaimRewardsDialog.close',
              defaultMessage: 'Close rewards dialog',
            })}
          />
        </Actions>
      </>
    </Dialog>
  );
};
