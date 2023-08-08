import { FormattedMessage, defineMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import BannerWrapper from '@core/components/BannerWrapper';
import { ChooseYourSportContent } from '@core/components/landing/ChooseYourSport/Content';
import { BlockTitle } from '@core/components/landing/LandingBaseball/ui';
import { tabletAndAbove } from '@core/style/mediaQuery';

import exporeOtherSportsBackground from './assets/exploreOtherSportsBackground.jpg';

const messages = defineMessage({
  id: 'otherSportsBlock.explore',
  defaultMessage: 'Explore other sports',
});

const OtherSportsTitleWrapper = styled.div`
  padding: calc(var(--unit) * 5);
  background-image: url(${exporeOtherSportsBackground});

  @media ${tabletAndAbove} {
    padding: calc(var(--unit) * 8);
  }
`;

const OtherSportsTitle = styled(BlockTitle)`
  line-height: 21px;
  @media ${tabletAndAbove} {
    line-height: 42px;
  }
`;

const SportsWrapper = styled.div`
  @media ${tabletAndAbove} {
    display: flex;
    padding: var(--triple-unit);
  }
`;

type Props = {
  currentSport: Sport;
  anchor?: string;
};

export const OtherSportsBlock = ({ currentSport, anchor = '' }: Props) => {
  return (
    <div id={anchor}>
      <OtherSportsTitleWrapper>
        <OtherSportsTitle>
          <FormattedMessage {...messages} />
        </OtherSportsTitle>
      </OtherSportsTitleWrapper>
      <BannerWrapper dark sport={Sport.NBA}>
        <SportsWrapper>
          <ChooseYourSportContent
            hideDescription
            hideMobileNavigation
            hideNBA={currentSport === Sport.NBA}
            hideBaseball={currentSport === Sport.BASEBALL}
          />
        </SportsWrapper>
      </BannerWrapper>
    </div>
  );
};
