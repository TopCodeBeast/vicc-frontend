import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { CardQuality, Rarity, Sport } from '__generated__/globalTypes';
import { Ball } from '@core/atoms/icons/Ball';
import { MLBBall } from '@core/atoms/icons/MLBBall';
import { NBABall } from '@core/atoms/icons/NBABall';
import { Text18, Title3, Title4 } from '@core/atoms/typography';
import { Tab, TabBar } from '@core/components/TabBar';
import CardBack from '@core/components/card/Back';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { Lifecycle } from '@core/hooks/useLifecycle';
import { sportsLabelsMessages } from '@core/lib/glossary';
import { qualityNames } from '@core/lib/players';
import { CARDS_REQUIREMENTS_BY_SPORT } from '@core/lib/referral';
import { scarcityMessages } from '@core/lib/scarcity';
import { laptopAndAbove } from '@core/style/mediaQuery';

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

  @media ${laptopAndAbove} {
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

const SportIcon = ({ sport }: { sport: Sport }) => {
  if (sport === Sport.CRICKET) return <Ball />;
  if (sport === Sport.NBA) return <NBABall />;
  return <MLBBall />;
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--unit);
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
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
      ? Sport.CRICKET
      : sport
  );

  const sports = [Sport.CRICKET, Sport.NBA];
  if (useNewMlbReferralProgram) sports.push(Sport.BASEBALL);

  return (
    <Container>
      <Header>
        <Title4>
          <FormattedMessage {...messages.title} />
        </Title4>
        <TabBar value={selectedSport}>
          {/* {sports.map(s => (
            <Tab key={s} value={s} onClick={() => setSelectedSport(s)}>
              <SportIcon sport={s} />
              <FormattedMessage {...sportsLabelsMessages[s]} />
            </Tab>
          ))} */}
        </TabBar>
      </Header>
      {selectedSport &&
        [Sport.CRICKET, Sport.BASEBALL].includes(selectedSport) && (
          <MilestonesNotice sport={selectedSport} />
        )}
      {selectedSport === Sport.NBA && <GenericNotice sport={selectedSport} />}
    </Container>
  );
};

export default Notice;
