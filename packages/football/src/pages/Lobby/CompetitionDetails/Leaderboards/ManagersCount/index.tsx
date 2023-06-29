import { faUserFriends } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

const Root = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--half-unit);
  margin-left: auto;
`;

const ManagersCount = ({ count }: { count?: number }) => {
  const { formatNumber } = useIntlContext();

  if (!count) return null;

  return (
    <Root>
      <Text16>
        {formatNumber(count)}&nbsp;
        <FontAwesomeIcon icon={faUserFriends} />
      </Text16>
    </Root>
  );
};

export default ManagersCount;
