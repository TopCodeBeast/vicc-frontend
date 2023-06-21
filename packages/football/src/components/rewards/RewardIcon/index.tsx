import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { ScarcityBackground } from '@sorare/core/src/atoms/layout/ScarcityBackground';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

export type RewardType = Rarity | 'money';

const Root = styled(ScarcityBackground)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  padding: var(--unit) 6px;
  border-radius: var(--half-unit);
  color: var(--c-neutral-100);
  font-size: 12px;
  &.common {
    border: 1px solid var(--c-neutral-300);
  }
  &.money {
    color: var(--c-static-neutral-1000);
  }
`;

type Props = { scarcity: RewardType };
const RewardIcon = ({ scarcity }: Props) => {
  const { formatMessage } = useIntl();
  const isMoney = scarcity === 'money';

  const icon = isMoney ? (
    <FontAwesomeIcon icon={faEthereum} size="lg" />
  ) : (
    <FontAwesomeIcon icon={faUser} />
  );

  return (
    <Root
      className={scarcity}
      title={isMoney ? undefined : formatMessage(scarcityMessages[scarcity])}
    >
      {icon}
    </Root>
  );
};

export default RewardIcon;
