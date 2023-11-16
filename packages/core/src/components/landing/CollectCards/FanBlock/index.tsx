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
  background: url("assets/fields/fans_background.png");
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
  margin-bottom: 50px;
  @media ${tabletAndAbove} {
    min-width: 300px;
    margin-bottom: 0px;
    flex: 3 1 0;
  }
`;

const CenterDiv = styled.div`
  margin: auto;
  width: 100%;
  @media ${tabletAndAbove} {
    margin: auto;
    width: 50%;
  }
`;
const TileContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  grid-gap: 12px;
  margin: 4px;
`;
const ItemView = styled.img`
  max-height: 148px;
  width: 100%;
  content: url("assets/fields/player2.png");
  object-fit: fill;
`;
const LargeItemView = styled.img`
  max-height: 296px;
  width: 100%;
  content: url("assets/fields/player.png");
  object-fit: fill;
`;

const Illustration = ({
  sport = Sport.BASEBALL,
}: {
  sport: Sport.BASEBALL | Sport.NBA;
}) => {
  return (
    <FieldWrapper>
      <TileContainer>
        <ItemView/>
        <ItemView/>
        <LargeItemView/>
      </TileContainer>
      <TileContainer>
        <LargeItemView/>
        <ItemView/>
        <ItemView/>
      </TileContainer>
    </FieldWrapper>
  );
};

export const FanBlock = () => (
  <Wrapper>
    <CenterDiv>
      <SectionText
        heading={
          <FormattedMessage
            id="Landing.CollectCards.WinBlock.heading"
            defaultMessage="Play Against Global Fans"
            values={{
              br: <br />,
            }}
          />
        }
        subHeading={
          <FormattedMessage
            id="Landing.CollectCards.WinBlock.subheading"
            defaultMessage="Submit five-player lineups (football & NBA) or seven player lineups (MLB) in a range of free competitions against Vicc Managers around the world. Plus, play against friends in private leagues."
          />
        }
      />
    </CenterDiv>
    <Illustration sport={Sport.BASEBALL} />
  </Wrapper>
);
