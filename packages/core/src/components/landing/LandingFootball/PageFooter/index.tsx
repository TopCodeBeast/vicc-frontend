import { ReactNode } from 'react';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import PlayNowButton from 'components/landing/LandingFootball/PlayNowButton';
import { theme } from '@sorare/core/src/style/theme';

import BannerWrapper from '../../../BannerWrapper';

const BackgroundImage = styled.div`
  border-bottom: 1px solid #e7e7df;
  background-position: center;
  background-size: cover;
  color: var(--c-static-neutral-100);
`;

const Wrapper = styled(Container)`
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 200px;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: 160px 0;
    gap: 40px;
  }
`;

const PageFooter = ({
  title,
  to,
  bgImage,
  dark,
}: {
  title: ReactNode;
  to: string;
  bgImage: string;
  dark?: boolean;
}) => {
  return (
    <BannerWrapper sport={Sport.FOOTBALL} dark={dark}>
      <BackgroundImage style={{ backgroundImage: `url(${bgImage})` }}>
        <Wrapper>
          {title}
          <PlayNowButton to={to} color="white" />
        </Wrapper>
      </BackgroundImage>
    </BannerWrapper>
  );
};

export default PageFooter;
