import { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Share } from '@sorare/core/src/atoms/icons/Share';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import Dialog from '@sorare/core/src/components/dialog';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import {
  FOOTBALL_LIVE_LINEUPS,
  FOOTBALL_PLAY_WEEKLY,
} from '@sorare/core/src/constants/routes';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { lineupPositions } from '@sorare/core/src/lib/players';
import { Link } from '@sorare/core/src/routing/Link';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { useComposeTeamContext } from '@football/components/so5/ComposeTeam/Context';
import DivisionLogo from '@football/components/so5/DivisionLogo';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: var(--unit) var(--quadruple-unit);
  gap: var(--double-unit);
`;

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  & > img {
    width: 16px;
  }
`;

const CardsWrapper = styled.div`
  position: relative;
  margin-bottom: 64px;
  @media ${tabletAndAbove} {
    margin-bottom: 128px;
  }
  &::before {
    content: '';
    background: linear-gradient(
      -45deg,
      var(--c-neutral-200),
      var(--c-neutral-400)
    );
    inset: -10% 5%;
    position: absolute;
    border-radius: var(--double-unit);
    transform: perspective(1000px) rotateX(50deg) translateY(20%);
    @media ${tabletAndAbove} {
      inset: 0 10%;
    }
  }
`;

const Cards = styled.div`
  isolation: isolate;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100%;
  align-self: center;
  /*
   * Place players according to the following terrain
   * 4_Fw  5_Extra
   *   ::before
   * 2_Df  3_Md
   *    1_Gk
   */

  /** Line break */
  &::before {
    content: '';
    width: 100%;
    order: 1;
  }
  > * {
    &:nth-child(1) {
      order: 3;
      --y: 25%;
      transform: translateY(var(--y));
    }

    &:nth-child(2) {
      order: 2;
    }
    &:nth-child(3) {
      order: 4;
    }
  }
`;

const CardWrapper = styled.div`
  width: 25%;
  margin: var(--unit);
  @media ${tabletAndAbove} {
    margin: var(--double-unit);
    width: 120px;
  }
`;

const ShareButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
`;

export const SubmitSuccessDialog = () => {
  const { so5Lineup, so5Leaderboard, lineup } = useComposeTeamContext();
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isOpenedOnce = useRef(false);

  if (
    (location.state as any)?.shouldShowSuccessDialog &&
    !open &&
    !isOpenedOnce.current
  ) {
    isOpenedOnce.current = true;
    setOpen(true);
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="xl"
      body={
        <Wrapper>
          <Title2>
            <FormattedMessage
              id="ComposeTeam.SubmitSuccessDialog.title"
              defaultMessage="Team submitted"
            />
          </Title2>
          <Subtitle>
            <DivisionLogo so5Leaderboard={so5Leaderboard} />
            <Text16 bold color="var(--c-neutral-600)">
              {so5Leaderboard.displayName}
            </Text16>
          </Subtitle>
          <CardsWrapper>
            <Cards>
              {lineupPositions.map(position => {
                const { card } = lineup[position];
                if (!card?.pictureUrl) {
                  return null;
                }
                return (
                  <CardWrapper key={card.slug}>
                    <CardImg src={card.pictureUrl} width={160} alt="" />
                  </CardWrapper>
                );
              })}
            </Cards>
            {so5Lineup.socialPictureUrls && (
              <SocialShare
                image={so5Lineup.socialPictureUrls}
                trackingEventName={socialShareEventName.SHARE_LINEUP}
                trackingEventContext={socialShareEventContext.LEADERBOARD}
                renderButton={({ onClick }) =>
                  isDesktop ? (
                    <ShareButton
                      disableDebounce
                      color="white"
                      onClick={onClick}
                      endIcon={<Share />}
                      medium
                    >
                      <FormattedMessage
                        id="ComposeTeam.SubmitSuccessDialog.share"
                        defaultMessage="Share lineup"
                      />
                    </ShareButton>
                  ) : (
                    <ShareButton
                      as={IconButton}
                      color="white"
                      onClick={onClick}
                    >
                      <Share />
                    </ShareButton>
                  )
                }
              />
            )}
          </CardsWrapper>
          <Button
            color="blue"
            medium
            component={Link}
            to={FOOTBALL_PLAY_WEEKLY}
          >
            <FormattedMessage
              id="ComposeTeam.SubmitSuccessDialog.composeNewTeam"
              defaultMessage="Compose a new team"
            />
          </Button>
          <Button
            color="white"
            small
            component={Link}
            to={FOOTBALL_LIVE_LINEUPS}
          >
            <FormattedMessage
              id="ComposeTeam.SubmitSuccessDialog.checkSubmittedLineups"
              defaultMessage="Check live lineups"
            />
          </Button>
        </Wrapper>
      }
    />
  );
};
