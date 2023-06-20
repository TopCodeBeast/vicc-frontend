import { faCheck, faWarning } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import addUser from '@sorare/core/src/assets/user/add-user.svg';
import { Locker } from '@sorare/core/src/atoms/icons/Locker';

const IconWrapper = styled.span`
  opacity: 0.4;
  pointer-events: none;
`;

type Props = {
  rarity: Rarity;
  locked: boolean;
  empty: boolean;
  available: boolean;
};
const PlaceholderIcon = ({ rarity, locked, empty, available }: Props) => {
  if (locked) {
    if (rarity === 'common' || available) {
      return (
        <FontAwesomeIcon
          icon={faCheck}
          size="lg"
          color="var(--c-static-green-300)"
        />
      );
    }
    return (
      <IconWrapper>
        <Locker title="locked" />
      </IconWrapper>
    );
  }
  if (empty) {
    return (
      <IconWrapper>
        <img src={addUser} alt="Add Player" />
      </IconWrapper>
    );
  }
  return <FontAwesomeIcon icon={faWarning} size="lg" />;
};

export default PlaceholderIcon;
