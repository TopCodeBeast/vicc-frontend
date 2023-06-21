import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
import { buildFilterQuery } from '@sorare/core/src/components/search/InstantSearch';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import {
  FOOTBALL_PLAYER_SHOW,
  FOOTBALL_PLAYER_SHOW_CARDS,
  FOOTBALL_PLAYER_SHOW_DESCRIPTION,
} from '@sorare/core/src/constants/routes';
import { glossary } from '@sorare/core/src/lib/glossary';
import PageWithTabs from '@sorare/core/src/routing/PageWithTabs';

import Description from '@football/pages/Player/Description';
import Header from '@football/pages/Player/Header';
import Search from '@football/pages/Player/Search';

import { PlayerPageContent_player } from './__generated__/index.graphql';

type Props = {
  player: PlayerPageContent_player;
  setPosition: (position?: Position) => void;
  selectedPosition?: Position;
  InfiniteScrollLoader?: ReactNode;
};
const LeaguePageContent = ({
  player,
  setPosition,
  selectedPosition,
  InfiniteScrollLoader,
}: Props) => {
  const { formatMessage } = useIntl();

  const tabItems = [
    {
      path: FOOTBALL_PLAYER_SHOW_DESCRIPTION,
      label: formatMessage(glossary.stats),
      isIndex: true,
      tabContent: (
        <Description
          player={player}
          setPosition={setPosition}
          selectedPosition={selectedPosition}
          InfiniteScrollLoader={InfiniteScrollLoader}
        />
      ),
    },
    {
      path: FOOTBALL_PLAYER_SHOW_CARDS,
      search: buildFilterQuery({
        [SEARCH_PARAMS.ON_SALE]: true,
      }),
      label: formatMessage(glossary.cards),
      tabContent: <Search player={player} />,
    },
  ];

  return (
    <>
      <ConversionCreditBanner />
      <PageWithTabs
        pageSlug={player.slug}
        pagePath={FOOTBALL_PLAYER_SHOW}
        items={tabItems}
      >
        <Header player={player} />
      </PageWithTabs>
    </>
  );
};

LeaguePageContent.fragments = {
  player: gql`
    fragment PlayerPageContent_player on Player {
      slug
      ...Header_player
      ...PlayerSearch_player
      ...Description_player
    }
    ${Header.fragments.player}
    ${Search.fragments.player}
    ${Description.fragments.player}
  `,
};

export default LeaguePageContent;
