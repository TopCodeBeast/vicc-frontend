import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { CardQuality, Rarity, Sport } from '@core/__generated__/globalTypes';
import { Ball } from '@core/atoms/icons/Ball';
import { MLBBall } from '@core/atoms/icons/MLBBall';
import { NBABall } from '@core/atoms/icons/NBABall';
import { SecondaryTabs } from '@core/atoms/navigation/SecondaryTabs';
import { Text18, Title3, Title4 } from '@core/atoms/typography';
import CardBack from '@core/components/card/Back';
import { INVITE } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { Lifecycle } from '@core/hooks/useLifecycle';
import { sportsLabelsMessages } from '@core/lib/glossary';
import { qualityNames } from '@core/lib/players';
import { CARDS_REQUIREMENTS_BY_SPORT } from '@core/lib/referral';
import { scarcityMessages } from '@core/lib/scarcity';
import { theme } from '@core/style/theme';

import { MilestonesNotice } from './MilestonesNotice';
import { messages } from './messages';
import { CardContainer, TextContent } from './ui';

const StyledDesignBlock = styled.div`
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: calc(6 * var(--unit));
  justify-content: center;
  align-items: center;
  background: var(--c-neutral-300);
  padding: var(--double-unit);
  border-radius: var(--double-unit);

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    flex-direction: row;
  }

  & > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--double-unit);
  }
`;
const StyledTextContent = styled(TextContent)`
  text-align: center;
`;

const GenericNotice = ({
  showTier,
  showUnique,
  sport,
}: {
  sport: Sport;
  showTier?: boolean;
  showUnique?: boolean;
}) => {
  return (
    <div>
      <StyledDesignBlock>
        <div>
          <CardContainer>
            <CardBack rarity={Rarity.limited} />
          </CardContainer>
          <StyledTextContent>
            <Title3>
              <FormattedMessage
                {...messages.description}
                values={{ count: CARDS_REQUIREMENTS_BY_SPORT[sport] }}
              />
            </Title3>
            <Text18>
              <FormattedMessage {...scarcityMessages.limited} />{' '}
              {showTier && <b>{qualityNames[CardQuality.TIER_3]}</b>}
            </Text18>
          </StyledTextContent>
        </div>
        {showUnique && (
          <div>
            <CardContainer>
              <CardBack rarity={Rarity.unique} />
            </CardContainer>
            <StyledTextContent>
              <Title3>
                <FormattedMessage
                  id="Notice.whenThirtyReferred"
                  defaultMessage="When you have 30 successful referred friends"
                />
              </Title3>
              <Text18>
                <FormattedMessage {...scarcityMessages.unique} />{' '}
                {showTier && <b>{qualityNames[CardQuality.TIER_4]}</b>}
              </Text18>
            </StyledTextContent>
          </div>
        )}
      </StyledDesignBlock>
    </div>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const Notice = () => {
  const { currentUser } = useCurrentUserContext();
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const sport = lifecycle?.lastVisitedSport;
  const {
    flags: { useNewMlbReferralProgram = false },
  } = useFeatureFlags();
  const [selectedSport, setSelectedSport] = useState(
    sport === Sport.BASEBALL && !useNewMlbReferralProgram
      ? Sport.FOOTBALL
      : sport
  );

  const TabsItems = [
    {
      key: Sport.FOOTBALL,
      to: INVITE,
      onClick: () => setSelectedSport(Sport.FOOTBALL),
      active: selectedSport === Sport.FOOTBALL,
      label: <FormattedMessage {...sportsLabelsMessages.FOOTBALL} />,
      icon: <Ball />,
    },
    {
      key: Sport.NBA,
      to: INVITE,
      active: selectedSport === Sport.NBA,
      onClick: () => setSelectedSport(Sport.NBA),
      label: <FormattedMessage {...sportsLabelsMessages.NBA} />,
      icon: <NBABall />,
    },
    ...(useNewMlbReferralProgram
      ? [
          {
            key: Sport.BASEBALL,
            to: INVITE,
            active: selectedSport === Sport.BASEBALL,
            onClick: () => setSelectedSport(Sport.BASEBALL),
            label: <FormattedMessage {...sportsLabelsMessages.BASEBALL} />,
            icon: <MLBBall />,
          },
        ]
      : []),
  ];

  return (
    <Container>
      <Header>
        <Title4>
          <FormattedMessage {...messages.title} />
        </Title4>
        <SecondaryTabs items={TabsItems} noBorder />
      </Header>
      {selectedSport &&
        [Sport.FOOTBALL, Sport.BASEBALL].includes(selectedSport) && (
          <MilestonesNotice sport={selectedSport} />
        )}
      {selectedSport === Sport.NBA && <GenericNotice sport={selectedSport} />}
    </Container>
  );
};

export default Notice;
