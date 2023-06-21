import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import CloseButton from '@core/atoms/buttons/CloseButton';
import { Text16, Title2 } from '@core/atoms/typography';
import Dialog from '@core/components/dialog';
import {
  FOOTBALL_LOBBY_UPCOMING,
  FOOTBALL_NEW_SIGNINGS,
} from '@core/constants/routes';
import { useBgLocation } from '@core/hooks/useBgLocation';
import { avoidOrphan } from '@core/lib/text';
import { theme } from '@core/style/theme';

import bundesliga from './assets/bundesliga.png';
import laLiga from './assets/laliga.png';
import ligue1 from './assets/ligue_1.png';
import mls from './assets/mls.png';
import premierLeague from './assets/premier_league.png';
import serieA from './assets/serie_a.png';
import tournamentList from './assets/tournaments_list.png';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: 480px;
  }
`;
const CloseButtonWrapper = styled.div`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c-neutral-1000);
  height: 240px;
  gap: 20px;
`;
const TeamImage = styled.img`
  height: 40px;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    height: 50px;
  }
`;
const TournamentListImage = styled.img`
  height: 146px;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--triple-unit);
  gap: var(--double-unit);
  text-align: center;
`;
const GreyText16 = styled(Text16)`
  color: var(--c-neutral-600);
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const ClubGameDialog = () => {
  const location = useBgLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { formatMessage } = useIntl();

  const onClose = () => {
    if (location?.pathname) {
      navigate(location.pathname + location?.search);
    } else {
      navigate(FOOTBALL_LOBBY_UPCOMING);
    }
  };

  const STEPS = [
    {
      header: (
        <>
          <TeamImage src={premierLeague} alt="" />
          <TeamImage src={ligue1} alt="" />
          <TeamImage src={laLiga} alt="" />
          <TeamImage src={bundesliga} alt="" />
          <TeamImage src={serieA} alt="" />
          <TeamImage src={mls} alt="" />
        </>
      ),
      body: (
        <>
          <Title2>
            {avoidOrphan(
              formatMessage({
                id: 'Lobby.Upcoming.ClubGameDialog.Step1.Title',
                defaultMessage: 'Pick your Favorite Players and Win',
              })
            )}
          </Title2>
          <GreyText16>
            {avoidOrphan(
              formatMessage({
                id: 'Lobby.Upcoming.ClubGameDialog.Step1.Text',
                defaultMessage:
                  'In each league that you choose, you’ll be able to collect Cards of your favorite players and compete every week for amazing rewards.',
              })
            )}
          </GreyText16>
        </>
      ),
      cta: (
        <>
          <Button
            component={Link}
            to={`${FOOTBALL_NEW_SIGNINGS}?pn=true`}
            medium
            color="blue"
          >
            <FormattedMessage
              id="Lobby.Upcoming.ClubGameDialog.Step1.Cta"
              defaultMessage="Start now"
            />
          </Button>
          <Button onClick={() => setStep(step + 1)} medium color="transparent">
            <FormattedMessage
              id="Lobby.Upcoming.ClubGameDialog.Step1.SecondaryCta"
              defaultMessage="Learn more"
            />
          </Button>
        </>
      ),
    },
    {
      header: <TournamentListImage src={tournamentList} alt="" />,
      body: (
        <>
          <Title2>
            {avoidOrphan(
              formatMessage({
                id: 'Lobby.Upcoming.ClubGameDialog.Step2.Title',
                defaultMessage: 'Rise To The Top',
              })
            )}
          </Title2>
          <GreyText16>
            {avoidOrphan(
              formatMessage({
                id: 'Lobby.Upcoming.ClubGameDialog.Step2.Text',
                defaultMessage:
                  'By collecting Limited Cards, you will be able to enter new competitions with even better rewards. Semi-Pro requires 1 Limited Card. Pro 270 requires 4 Limited Cards.',
              })
            )}
          </GreyText16>
        </>
      ),
      cta: (
        <Button
          component={Link}
          to={`${FOOTBALL_NEW_SIGNINGS}?rarity=limited&pn=true`}
          medium
          color="blue"
        >
          <FormattedMessage
            id="Lobby.Upcoming.ClubGameDialog.Step2.Cta"
            defaultMessage="Get Your first Limited Card"
          />
        </Button>
      ),
    },
  ];

  return (
    <Dialog
      open
      maxWidth={false}
      defaultBackUrl={FOOTBALL_LOBBY_UPCOMING}
      onClose={onClose}
    >
      <DialogContainer>
        <CloseButtonWrapper>
          <CloseButton onClose={onClose} />
        </CloseButtonWrapper>
        <Header>{STEPS[step].header}</Header>
        <Body>
          {STEPS[step].body}
          <ButtonsContainer>{STEPS[step].cta}</ButtonsContainer>
        </Body>
      </DialogContainer>
    </Dialog>
  );
};

export default ClubGameDialog;
