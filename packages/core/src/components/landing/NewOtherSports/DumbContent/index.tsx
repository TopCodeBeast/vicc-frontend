import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { ViccLogo } from '@core/atoms/icons/SorareLogo';
import SmallerStarBall from '@core/atoms/navigation/SmallerStarBall';
import { Text16 } from '@core/atoms/typography';
import ResponsiveImg from '@core/atoms/ui/ResponsiveImg';
import { useSportCTAProps } from '@core/components/landing/FeaturedSport/useSportCTAProps';
import { glossary } from '@core/lib/glossary';
import { tabletAndAbove } from '@core/style/mediaQuery';

const SportWrapper = styled.div`
  padding: var(--double-and-a-half-unit) 0 var(--double-and-a-half-unit)
    var(--double-and-a-half-unit);
  border-radius: var(--unit);
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  aspect-ratio: 0.8;
  position: relative;

  overflow: hidden;
  display: grid;
  grid-template-areas:
    'logos cards'
    'content cards';
  grid-template-columns: 3fr 1fr;
  grid-template-rows: max-content 1fr;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      transparent 100%
    );
  }

  & > * {
    z-index: 1;
  }

  @media ${tabletAndAbove} {
    aspect-ratio: 1;
    grid-template-columns: 4fr 1fr;
  }
`;

const Content = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  max-width: 70%;
  align-self: end;
`;

const SportName = styled.p`
  font-size: 28px;
  font-family: 'Druk Wide';
  text-transform: uppercase;
`;

const LogoWrapper = styled.div`
  grid-area: logos;
  top: var(--quadruple-unit);
  display: flex;
  gap: var(--unit);
  height: var(--triple-unit);
  align-items: center;
`;

const StarBall = styled(SmallerStarBall)`
  margin-right: var(--unit);
`;

const CardsArea = styled.div`
  grid-area: cards;
  display: flex;
  flex-direction: column;
  flex-shrink: 0.18;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: var(--half-unit);
  padding: 0 var(--unit);
`;

const CardImage = styled(ResponsiveImg).attrs({
  cropWidth: 160,
  draggable: false,
})`
  width: 100%;
  aspect-ratio: var(--card-aspect-ratio);
`;

type Props = {
  sport: Sport;
  text: string;
  title: string;
  bgImage: string;
  logos?: ReactNode;
  cardsUrls: string[];
};

export const DumbContent = ({
  text,
  sport,
  title,
  logos,
  bgImage,
  cardsUrls,
}: Props) => {
  const { formatMessage } = useIntl();
  const CTAProps = useSportCTAProps(sport);

  return (
    <SportWrapper style={{ backgroundImage: `url(${bgImage})` }}>
      <LogoWrapper>
        <div>
          <StarBall />
          <ViccLogo />
        </div>
        {logos}
      </LogoWrapper>
      <Content>
        <SportName>{title}</SportName>
        <Text16>{text}</Text16>
        <div>
          <Button color="white" medium {...CTAProps}>
            {formatMessage(glossary.playNow)}
          </Button>
        </div>
      </Content>
      <CardsArea>
        {cardsUrls?.map(cardUrl => (
          <CardImage key={cardUrl} src={cardUrl} alt="" />
        ))}
      </CardsArea>
    </SportWrapper>
  );
};
