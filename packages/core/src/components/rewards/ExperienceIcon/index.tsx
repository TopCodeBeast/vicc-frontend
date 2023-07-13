import classNames from 'classnames';
import styled from 'styled-components';

import { CustomRewardExperience } from '__generated__/globalTypes';
import experiences from '@core/assets/rewards/experiences.png';
import jerseys from '@core/assets/rewards/jerseys.png';
import merch from '@core/assets/rewards/merch.png';
import tickets from '@core/assets/rewards/tickets.png';

const Img = styled.img`
  height: 28px;
  &.sm {
    height: 20px;
  }
`;

type Props = {
  type: CustomRewardExperience | null;
  pictureUrl?: string | null;
  sm?: boolean;
};

const ICON_URLS: { [key in CustomRewardExperience]?: string } = {
  [CustomRewardExperience.JERSEY]: jerseys,
  [CustomRewardExperience.TICKET]: tickets,
  [CustomRewardExperience.EVENT]: experiences,
  [CustomRewardExperience.MERCH]: merch,
};

const ExperienceIcon = ({ type, pictureUrl, sm }: Props) => {
  const imgUrl =
    ICON_URLS[type || CustomRewardExperience.EVENT] ||
    ICON_URLS[CustomRewardExperience.EVENT];

  return (
    <Img
      className={classNames({ sm })}
      src={pictureUrl || imgUrl}
      alt=""
      onError={e => {
        if (pictureUrl) {
          (e.target as any).src = Image;
        }
      }}
    />
  );
};

export default ExperienceIcon;
