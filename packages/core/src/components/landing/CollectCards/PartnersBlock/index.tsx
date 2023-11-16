import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CardRarity, Sport } from '__generated__/globalTypes';
import { ImageCard } from '@core/components/cards/ImageCard';
import { useIntlContext } from '@core/contexts/intl';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { SectionFullText } from '../SectionFullText';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: var(--double-unit);
  column-gap: calc(10 * var(--unit));
  position: relative;

  @media ${tabletAndAbove} {
    flex-direction: column;
    column-gap: calc(7 * var(--unit));
    padding-left: calc(21 * var(--unit));
    padding-right: calc(21 * var(--unit));
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  @media ${tabletAndAbove} {
    min-width: 480px;
    margin-bottom: 0px;
    margin-top: 30px;
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
    width: 480px;
  }
`;

const LimitedCard = styled(CardShadow).attrs({ scarcity: CardRarity.limited })`
  z-index: 2;
  max-height: 130px;
  margin-left: -50px;
  @media ${tabletAndAbove} {
    max-height: 243px;
    margin-left: -80px;
    width: 480px;
  }
`;

const RareCard = styled(CardShadow).attrs({ scarcity: CardRarity.rare })`
  z-index: 3;
  max-height: 148px;
  margin-left: -45px;
  @media ${tabletAndAbove} {
    max-height: 270px;
    margin-left: -90px;
    width: 480px;
  }
`;

const CommonCard = styled(CardShadow).attrs({ scarcity: CardRarity.common })`
  z-index: 2;
  max-height: 130px;
  margin-left: -40px;
  @media ${tabletAndAbove} {
    max-height: 243px;
    margin-left: -80px;
    width: 480px;
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
    width: 480px;
  }
`;
const CenterDiv = styled.div`
  margin-top: 36px;
`;
const TileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
  grid-gap: 12px;
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(auto-fit, minmax(15%, 1fr));
  }
`;
const ItemView = styled.img`
  min-height: 78px;
  content: url("assets/fields/group.png");
  object-fit: none;
  @media ${tabletAndAbove} {
    min-height: 148px;
  }
`;

const Illustration = ({
  sport = Sport.BASEBALL,
}: {
  sport: Sport.BASEBALL | Sport.NBA;
}) => {
  return (
    <FieldWrapper>
      <UniqueCard sport={sport} image="bitcoin.png"/>
      <LimitedCard sport={sport} image="bitcoin.png"/>
      <RareCard sport={sport} image="bitcoin.png"/>
      <CommonCard sport={sport} image="bitcoin.png"/>
      <SuperRareCard sport={sport} image="bitcoin.png"/>
    </FieldWrapper>
  );
};

export const PartnersBlock = () => (
  <Wrapper>
    <SectionFullText
      heading={
        <FormattedMessage
          id="Landing.CollectCards.WinBlock.heading"
          defaultMessage="Vicc partners"
          values={{
            br: <br />,
          }}
        />
      }
      subHeading={
        <FormattedMessage
          id="Landing.CollectCards.WinBlock.subheading"
          defaultMessage="Dozens of high-profile athletes and investors have joined forces with Vicc as brand{br} ambassadors, advocates, and/or investors."
          values={{
            br: <br />,
          }}
        />
      }
    />
    <TileContainer>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
      <ItemView/>
    </TileContainer>
  </Wrapper>
);