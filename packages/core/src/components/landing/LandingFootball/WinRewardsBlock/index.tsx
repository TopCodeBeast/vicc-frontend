import { ReactNode } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import Container from '@core/atoms/layout/Container';
import {
  MixedFontTitle,
  Section,
  SubTitle,
} from '@core/components/landing/LandingFootball/ui';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useSlider from '@core/hooks/useSlider';
import { theme } from '@core/style/theme';

const messages = defineMessages({
  title: {
    id: 'Landing.WinRewards.defaultTitle',
    defaultMessage: 'Win Rewards',
  },
  subtitle: {
    id: 'Landing.WinRewards.defaultSubtitle',
    defaultMessage:
      'Win amazing prizes based on your players’ real-life performance.',
  },
});

const RewardsRow = styled.div`
  display: flex;
  width: 100%;
  gap: var(--unit);
  align-items: flex-start;
  overflow: auto;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
`;

const ImgContainer = styled.div`
  position: relative;
  padding-bottom: 100%;
  border-radius: var(--unit);
  width: 100%;
  display: flex;
  align-items: center;
  background-position: center;
  background-size: cover;
`;

const Label = styled.p`
  font-size: 22px;
  font-weight: 600;
  margin-top: var(--triple-unit);
`;

const Column = styled.div<{ $md: number }>`
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 100%;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    width: ${({ $md }) => `calc(calc(${$md} / 12 * 100%) - var(--unit))`};
  }
`;

const StyledSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    gap: var(--quadruple-unit);
  }
`;

export const WinRewardsImg = styled.img`
  max-width: 100%;
  min-width: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--unit);
  width: 100%;
`;

const Dots = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--c-static-neutral-100);
  opacity: 0.4;
  ${({ $active }) => $active && 'opacity: 1;'}
`;

interface Props {
  title?: MessageDescriptor;
  subtitle?: ReactNode;
  rewards: { label: MessageDescriptor; img: ReactNode }[];
  showSliderDotsIndicator?: boolean;
}

const WinRewards = ({
  title = messages.title,
  subtitle = <FormattedMessage {...messages.subtitle} />,
  rewards,
  showSliderDotsIndicator = false,
}: Props) => {
  const { up: isTablet } = useScreenSize('tablet');

  const { scrollerRef, active, handleDotClick } = useSlider();

  return (
    <Container>
      <StyledSection>
        <MixedFontTitle>
          <FormattedMessage
            {...title}
            values={{
              span: (...chunks: string[]) => {
                return <span>{chunks}</span>;
              },
              br: <br />,
            }}
          />
        </MixedFontTitle>
        {subtitle && <SubTitle>{subtitle}</SubTitle>}
        <RewardsRow ref={scrollerRef}>
          {rewards.map((reward, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Column key={i} $md={12 / rewards.length}>
              <ImgContainer>{reward.img}</ImgContainer>
              <Label>
                <FormattedMessage {...reward.label} />
              </Label>
            </Column>
          ))}
        </RewardsRow>
        {showSliderDotsIndicator && !isTablet && (
          <DotsContainer>
            {[...Array(rewards.length).keys()].map(i => (
              <Dots key={i} $active={active === i} onClick={handleDotClick} />
            ))}
          </DotsContainer>
        )}
      </StyledSection>
    </Container>
  );
};
export default WinRewards;
