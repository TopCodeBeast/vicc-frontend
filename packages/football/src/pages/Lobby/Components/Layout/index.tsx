import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { Calendar } from '@sorare/core/src/atoms/icons/Calendar';
import { Clock } from '@sorare/core/src/atoms/icons/Clock';
import Body from '@sorare/core/src/atoms/layout/Body';
import { Portal } from '@sorare/core/src/atoms/layout/Portal';
import { Tabs } from '@sorare/core/src/atoms/navigation/Tabs';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
import {
  FOOTBALL_LOBBY_LIVE_WILDCARD,
  FOOTBALL_LOBBY_UPCOMING_WILDCARD,
  goToLobby,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { UNBREAKABLE_SPACE } from '@sorare/core/src/lib/text';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { isFixtureLive, isFixtureOpened } from '@football/lib/so5';
import GameWeekDropdown from '@football/pages/Lobby/Components/GameWeekDropdown';
import { TopPlayers } from '@football/pages/Lobby/Components/TopPlayer';

import { Lobby_Layout_so5Fixture } from './__generated__/index.graphql';

const StyledBody = styled(Body)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;

const Wrapper = styled.div`
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  padding: var(--unit) 0;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: calc(3 * var(--unit));
  @media ${tabletAndAbove} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TabItem = styled.span`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const Live = styled.svg`
  display: inline-flex;
`;

const StyledTabs = styled(Tabs)`
  padding: 0;
  justify-content: space-between;
  --link-background: var(--c-neutral-300);
  --selector: var(--c-neutral-400);
  --activeLink: var(--c-neutral-1000);
  --link: var(--c-neutral-600);
`;

interface Props {
  children: React.ReactElement;
  so5Fixture?: Lobby_Layout_so5Fixture & { transient?: boolean };
  hidePlayers?: boolean;
}

export const Layout = ({
  children,
  // Default with non breakable space to avoid glitches
  so5Fixture = {
    __typename: 'So5Fixture',
    gameWeek: 0,
    slug: '',
    startDate: UNBREAKABLE_SPACE,
    endDate: UNBREAKABLE_SPACE,
    aasmState: '',
    displayName: UNBREAKABLE_SPACE,
    shortDisplayName: UNBREAKABLE_SPACE,
    transient: true,
  },
  hidePlayers,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const isUpcoming = isFixtureOpened(so5Fixture);
  const isLive = isFixtureLive(so5Fixture);
  const TabsItems = [
    {
      to: goToLobby('past'),
      label: (
        <TabItem>
          <Calendar />
          {formatMessage(fantasy.past)}
        </TabItem>
      ),
    },
    {
      to: goToLobby('live'),
      basePath: FOOTBALL_LOBBY_LIVE_WILDCARD,
      label: (
        <TabItem>
          <Ball />
          {formatMessage(fantasy.live)}
          <Live width="6" viewBox="0 0 6 6">
            <circle cx="3" cy="3" r="3" fill="var(--c-static-red-300)" />
          </Live>
        </TabItem>
      ),
    },
    {
      to: goToLobby('upcoming'),
      basePath: FOOTBALL_LOBBY_UPCOMING_WILDCARD,
      label: (
        <TabItem>
          <Clock />
          {formatMessage(fantasy.upcoming)}
        </TabItem>
      ),
    },
  ];

  return (
    <StyledBody>
      <Portal id="substicky-bar-portal">
        <ConversionCreditBanner />
        <Wrapper className="dark-theme">
          <Container>
            <HeaderContent>
              <div>
                <Title2>
                  <FormattedMessage
                    id="Lobby.Layout.Title"
                    defaultMessage="Lobby"
                  />
                </Title2>
                {!so5Fixture.transient && !isUpcoming ? (
                  <GameWeekDropdown
                    defaultFixture={so5Fixture}
                    enabled={!so5Fixture.transient && !isLive}
                  />
                ) : (
                  <Text16 bold>
                    <FormattedMessage
                      id="LobbyLayout.upcoming"
                      defaultMessage="Prepare ahead"
                    />
                  </Text16>
                )}
              </div>
              <StyledTabs items={TabsItems} />
            </HeaderContent>
          </Container>
        </Wrapper>
      </Portal>
      {children}
      {!hidePlayers && so5Fixture?.slug && (
        <TopPlayers so5Fixture={so5Fixture} />
      )}
    </StyledBody>
  );
};

Layout.fragments = {
  so5Fixture: gql`
    fragment Lobby_Layout_so5Fixture on So5Fixture {
      slug
      ...Lobby_GameWeekDropdownHeader_so5Fixture
    }
    ${GameWeekDropdown.fragments.so5Fixture}
  ` as TypedDocumentNode<Lobby_Layout_so5Fixture>,
};
