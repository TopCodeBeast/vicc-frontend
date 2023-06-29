import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParam } from 'react-use';
import styled from 'styled-components';

import { Rarity, Sport } from '@sorare/core/src/__generated__/globalTypes';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Title2 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_TRANSFER_MARKET,
  LEGACY_PLAYER_SHOW,
  MLB_SECONDARY_MARKET,
  NBA_SECONDARY_MARKET,
} from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { transferMarket } from '@sorare/core/src/lib/glossary';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

type Props = {
  player: {
    slug: string;
    displayName: string;
  };
  rarity: Rarity;
  sport: Sport;
};

const MarketTitleRow = styled.div`
  display: inline;
  @media ${laptopAndAbove} {
    display: inline-flex;
    align-items: center;
    gap: var(--unit);
  }
`;

const SecondaryMarketStackedTitle = styled(Title2)`
  display: inline;
  & > span:not(:first-child) {
    margin-left: var(--half-unit);
  }
  & a {
    color: var(--c-neutral-1000);
  }
  @media ${laptopAndAbove} {
    display: inline-flex;
    gap: var(--half-unit);
    & > span:not(:first-child) {
      margin-left: 0;
    }
  }
`;

const MobileSecondaryMarketStackedBackButtonContainer = styled.div`
  margin-bottom: var(--unit);
`;

const SECONDARY_MARKET_URLS = {
  [Sport.FOOTBALL]: FOOTBALL_TRANSFER_MARKET,
  [Sport.BASEBALL]: MLB_SECONDARY_MARKET,
  [Sport.NBA]: NBA_SECONDARY_MARKET,
};

export const MarketStackTitle = ({ player, rarity, sport }: Props) => {
  const navigate = useNavigate();
  const { generateSportPath } = useSportContext();
  const { up: isLaptop } = useScreenSize('laptop');
  const previousParams = useSearchParam('previousParams');
  const marketBaseUrl = SECONDARY_MARKET_URLS[sport];
  const playerUrl = generateSportPath(LEGACY_PLAYER_SHOW, {
    params: { slug: player.slug },
    sport,
  });
  const marketUrl = `${marketBaseUrl}${previousParams || ''}`;

  return (
    <MarketTitleRow>
      {isLaptop ? (
        <>
          <Link to={marketUrl}>
            <Title2 color="var(--c-neutral-500)">
              <FormattedMessage {...transferMarket.transfer} />
            </Title2>
          </Link>
          <FontAwesomeIcon icon={faChevronRight} color="var(--c-neutral-500)" />
        </>
      ) : (
        <MobileSecondaryMarketStackedBackButtonContainer>
          <IconButton
            color="white"
            small
            icon={faChevronLeft}
            onClick={() => navigate(marketUrl)}
          />
        </MobileSecondaryMarketStackedBackButtonContainer>
      )}
      <SecondaryMarketStackedTitle as="h3">
        <Link to={playerUrl}>{player.displayName}</Link>
        <span>
          <FormattedMessage {...scarcityMessages[rarity]} />
        </span>
      </SecondaryMarketStackedTitle>
    </MarketTitleRow>
  );
};
