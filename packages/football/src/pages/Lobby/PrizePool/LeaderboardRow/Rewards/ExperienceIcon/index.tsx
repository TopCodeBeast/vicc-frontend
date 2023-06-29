import { faTShirt, faTicket } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { CustomRewardExperience } from '@sorare/core/src/__generated__/globalTypes';

const Root = styled.div`
  display: flex;
  gap: var(--half-unit);
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--c-static-neutral-100);
  background: linear-gradient(
    rgba(193, 139, 235, 1) 0%,
    rgba(127, 47, 254, 1) 100%
  );
  border-radius: 100%;
`;
const Amount = styled.p`
  color: rgb(205, 156, 255);
`;

type Props = {
  type: CustomRewardExperience;
  amount: number;
};
const ExperienceIcon = ({ type, amount }: Props) => {
  const icon = (() => {
    if (type === CustomRewardExperience.JERSEY) {
      return faTShirt;
    }
    return faTicket;
  })();

  return (
    <Root>
      <IconWrapper>
        <FontAwesomeIcon icon={icon} size="xs" />
      </IconWrapper>
      <Amount>{amount}x</Amount>
    </Root>
  );
};

export default ExperienceIcon;
