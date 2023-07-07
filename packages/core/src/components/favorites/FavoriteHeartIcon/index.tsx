import { faHeart } from '@fortawesome/pro-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styled from 'styled-components';

interface Props {
  hasCurrentUserSubscription: boolean;
  solid?: boolean;
}

const FavoriteIcon = styled(FontAwesomeIcon)`
  width: 16px;
  height: 16px;
  color: var(--c-neutral-600);
  &.hasCurrentUserSubscription {
    color: var(--c-red-600);
  }
`;

export const FavoriteHeartIcon = ({
  hasCurrentUserSubscription,
  solid = true,
}: Props) => {
  return (
    <FavoriteIcon
      icon={solid || hasCurrentUserSubscription ? faHeartSolid : faHeart}
      className={classnames({
        hasCurrentUserSubscription,
      })}
    />
  );
};

export default FavoriteHeartIcon;
