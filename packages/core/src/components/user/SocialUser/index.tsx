import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

type Props = {
  nickname: string | null;
  icon: IconProp;
  prefix?: string;
};
const SocialUser = ({ nickname, icon, prefix = '' }: Props) => {
  if (!nickname) return null;

  return (
    <Root>
      <FontAwesomeIcon icon={icon} />
      {prefix}
      {nickname}
    </Root>
  );
};

export default SocialUser;
