import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { CardRarity } from '__generated__/usSportsGlobalTypes';
import { USSportCardBack } from '@core/components/cards/Back';
import { useIntlContext } from '@core/contexts/intl';
import { theme } from '@core/style/theme';

import { SectionText } from '../SectionText';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: var(--double-unit);
  column-gap: calc(10 * var(--unit));

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    column-gap: calc(21 * var(--unit));
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  margin-bottom: 50px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    min-width: 300px;
    margin-bottom: 0px;
    flex: 3 1 0;
  }
`;

const CardShadow = styled(USSportCardBack)`
  filter: drop-shadow(0 var(--unit) var(--double-unit) rgba(0, 0, 0, 0.5));
`;

const UniqueCard = styled(CardShadow).attrs({ scarcity: CardRarity.unique })`
  z-index: 1;
  max-height: 109px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-height: 203px;
  }
`;

const LimitedCard = styled(CardShadow).attrs({ scarcity: CardRarity.limited })`
  z-index: 2;
  max-height: 130px;
  margin-left: -50px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-height: 243px;
    margin-left: -80px;
  }
`;

const RareCard = styled(CardShadow).attrs({ scarcity: CardRarity.rare })`
  z-index: 3;
  max-height: 148px;
  margin-left: -45px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-height: 270px;
    margin-left: -90px;
  }
`;

const CommonCard = styled(CardShadow).attrs({ scarcity: CardRarity.common })`
  z-index: 2;
  max-height: 130px;
  margin-left: -40px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-height: 176px;
    margin-left: -80px;
  }
`;

const Illustration = ({
  sport = Sport.BASEBALL,
}: {
  sport: Sport.BASEBALL | Sport.NBA;
}) => {
  return (
    <FieldWrapper>
      <UniqueCard sport={sport} />
      <LimitedCard sport={sport} />
      <RareCard sport={sport} />
      <CommonCard sport={sport} />
      <SuperRareCard sport={sport} />
    </FieldWrapper>
  );
};

export const WinBlock = () => (
  <Wrapper>
    <Illustration sport={Sport.BASEBALL} />
    <SectionText
      heading={
        <FormattedMessage
          id="Landing.CollectCards.WinBlock.heading"
          defaultMessage="Win Epic Rewards"
          values={{
            br: <br />,
          }}
        />
      }
      subHeading={
        <FormattedMessage
          id="Landing.CollectCards.WinBlock.subheading"
          defaultMessage="Earn amazing rewards based on your players' real-life performance, including ETH, VIP experiences, match tickets, merch, and more."
        />
      }
    />
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
