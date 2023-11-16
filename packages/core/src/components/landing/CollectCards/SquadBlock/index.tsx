import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CardRarity, Sport } from '__generated__/globalTypes';
import { ImageCard } from '@core/components/cards/ImageCard';
import { useIntlContext } from '@core/contexts/intl';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { SectionText } from '../SectionText';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: var(--double-unit);
  column-gap: calc(10 * var(--unit));

  @media ${tabletAndAbove} {
    flex-direction: row;
    column-gap: calc(7 * var(--unit));
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: url("assets/fields/squad.jpg");
  background-size: cover; 
  background-repeat: no-repeat;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 36px;
  padding-bottom: 36px;
  margin-bottom: 50px;
  @media ${tabletAndAbove} {
    min-width: 300px;
    margin-bottom: 0px;
    flex: 3 1 0;
  }
`;

const CardShadow = styled(ImageCard)`
  filter: drop-shadow(0 var(--unit) var(--double-unit) rgba(0, 0, 0, 0.5));
`;

const UniqueCard = styled(CardShadow).attrs({ scarcity: CardRarity.unique })`
  z-index: 1;
  max-height: 109px;
  @media ${tabletAndAbove} {
    max-height: 203px;
  }
`;

const LimitedCard = styled(CardShadow).attrs({ scarcity: CardRarity.limited })`
  z-index: 2;
  max-height: 130px;
  margin-left: -50px;
  @media ${tabletAndAbove} {
    max-height: 243px;
    margin-left: -80px;
  }
`;

const RareCard = styled(CardShadow).attrs({ scarcity: CardRarity.rare })`
  z-index: 3;
  max-height: 148px;
  margin-left: -45px;
  @media ${tabletAndAbove} {
    max-height: 270px;
    margin-left: -90px;
  }
`;

const CommonCard = styled(CardShadow).attrs({ scarcity: CardRarity.common })`
  z-index: 2;
  max-height: 130px;
  margin-left: -40px;
  @media ${tabletAndAbove} {
    max-height: 243px;
    margin-left: -80px;
  }
`;

const SuperRareCard = styled(CardShadow).attrs({
  scarcity: CardRarity.super_rare,
})`
  z-index: 1;
  max-height: 94px;
  margin-left: -50px;
  @media ${tabletAndAbove} {
    max-height: 176px;
    margin-left: -80px;
  }
`;
const CenterDiv = styled.div`
  margin-top: 36px;
`;

const Illustration = ({
  sport = Sport.BASEBALL,
}: {
  sport: Sport.BASEBALL | Sport.NBA;
}) => {
  return (
    <FieldWrapper>
      <UniqueCard sport={sport} image="players/1.png"/>
      <LimitedCard sport={sport} image="players/2.png"/>
      <RareCard sport={sport} image="players/3.png"/>
      <CommonCard sport={sport} image="players/4.png"/>
      <SuperRareCard sport={sport} image="players/5.png"/>
    </FieldWrapper>
  );
};

export const SquadBlock = () => (
  <Wrapper>
    <Illustration sport={Sport.BASEBALL} />
    <CenterDiv>
      <SectionText
        heading={
          <FormattedMessage
            id="Landing.CollectCards.WinBlock.heading"
            defaultMessage="Build Your  Squad"
            values={{
              br: <br />,
            }}
          />
        }
        subHeading={
          <FormattedMessage
            id="Landing.CollectCards.WinBlock.subheading"
            defaultMessage="Collect, buy, sell, and trade officially licensed digital player cards in Vicc’s Marketplace to build your ultimate fantasy team. There are no sign-up costs."
          />
        }
      />
    </CenterDiv>
  </Wrapper>
);

export const WinBlockNBA = () => {
  const { formatMessage } = useIntlContext();
  return (
    <Wrapper>
      <Illustration sport={Sport.NBA} />
      <SectionText
        heading={formatMessage(
          {
            id: 'LandingNBA.WinBlock.lineOne',
            defaultMessage: 'Real{br}ownership',
          },
          {
            br: <br />,
          }
        )}
        subHeading={formatMessage({
          id: 'LandingNBA.WinBlock.scoreText',
          defaultMessage:
            'No other fantasy sports experience puts you in control of your legacy quite like this. Your player Cards carry over season-to-season unless you trade them away.',
        })}
      />
    </Wrapper>
  );
};
