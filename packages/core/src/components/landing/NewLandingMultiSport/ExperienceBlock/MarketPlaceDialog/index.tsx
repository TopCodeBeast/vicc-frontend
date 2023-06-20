import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import footballLogo from 'assets/logos/football/main.svg';
import mlbLogo from 'assets/logos/mlb/mlb.svg';
import nbaLogo from 'assets/logos/nba/nba.svg';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text16, Text20 } from '@sorare/core/src/atoms/typography';
import Dialog from 'components/dialog';
import {
  FOOTBALL_MARKET,
  MLB_PRIMARY_MARKET,
  NBA_PRIMARY_MARKET,
} from '@sorare/core/src/constants/routes';

const messages = defineMessages({
  title: {
    id: 'Landing.Experience.MarketDialog.title',
    defaultMessage: 'Strengthen Your Squad',
  },
  subtext: {
    id: 'Landing.Experience.MarketDialog.subtext',
    defaultMessage:
      "Scout players and use Sorare's Marketplace to buy or trade for their digital cards. Keep improving your team, week over week and season over season.",
  },
  mlbMarket: {
    id: 'Landing.Experience.MarketDialog.mlbMarket',
    defaultMessage: 'MLB Marketplace',
  },
  NBAMarket: {
    id: 'Landing.Experience.MarketDialog.NBAMarket',
    defaultMessage: 'NBA Marketplace',
  },
  FootballMarket: {
    id: 'Landing.Experience.MarketDialog.FootballMarket',
    defaultMessage: 'Football Marketplace',
  },
});

const Wrapper = styled.div`
  display: grid;
  gap: calc(var(--unit) * 5);
  padding: calc(var(--unit) * 6) var(--triple-unit);
`;

const StyledCloseButton = styled(IconButton)`
  justify-self: end;
`;

const Title = styled(Text20)`
  font-family: 'Druk Wide';
  text-transform: uppercase;
  margin-bottom: var(--unit);
`;

const ButtonsWrapper = styled.div`
  display: grid;
  gap: var(--unit);
  grid-auto-rows: 1fr;
`;

const Item = styled(LinkOverlay)`
  display: flex;
  position: relative;
  justify-content: space-between;
  border-radius: var(--intermediate-unit);
  background-color: rgba(255, 255, 255, 0.07);
  padding: var(--double-unit) var(--double-and-a-half-unit);
`;

const Image = styled.img`
  align-self: center;
`;

type Props = { open: boolean; onClose: () => void };

export const MarketPlaceDialog = ({ open, onClose }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog open={open} onClose={onClose} darkTheme maxWidth="xs">
      <Wrapper>
        <StyledCloseButton color="white" icon={faTimes} onClick={onClose} />
        <span>
          <Title>{formatMessage(messages.title)}</Title>
          <Text16 color="var(--c-static-neutral-500)">
            {formatMessage(messages.subtext)}
          </Text16>
        </span>
        <ButtonsWrapper>
          <Item href={MLB_PRIMARY_MARKET}>
            <Text16>{formatMessage(messages.mlbMarket)}</Text16>
            <Image src={mlbLogo} width={64} alt="" />
          </Item>
          <Item href={NBA_PRIMARY_MARKET}>
            <Text16>{formatMessage(messages.NBAMarket)}</Text16>
            <Image src={nbaLogo} height={64} alt="" />
          </Item>
          <Item href={FOOTBALL_MARKET}>
            <Text16>{formatMessage(messages.FootballMarket)}</Text16>
            <Image src={footballLogo} width={56} alt="" />
          </Item>
        </ButtonsWrapper>
      </Wrapper>
    </Dialog>
  );
};
