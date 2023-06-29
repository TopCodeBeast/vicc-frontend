import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Info } from '@sorare/core/src/atoms/icons/Info';
import { Caption, Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { NoCardEntryInfoDialog } from '@sorare/core/src/components/noCardEntry/NoCardEntryInfoDialog';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import So5NoCardEntryRegisterDialog from './So5NoCardEntryRegisterDialog';

const Root = styled.div`
  background: var(--c-neutral-200);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  row-gap: var(--unit);
  .dark-theme & {
    padding: var(--unit);
    border-radius: var(--unit);
    @media ${laptopAndAbove} {
      padding: var(--unit) var(--double-and-a-half-unit) var(--unit)
        var(--double-unit);
    }
  }
`;
const Cta = styled.div`
  width: 100%;
  @media ${laptopAndAbove} {
    width: auto;
  }
`;
const Title = styled.div`
  display: flex;
  gap: var(--unit);
`;
const TimeLeftWrapper = styled(Text14)`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-600);
  white-space: nowrap;
  &.closing {
    color: var(--c-static-red-300);
  }
`;

const messages = defineMessages({
  title: {
    id: 'Lobby.CompetitionList.NoCardEntry.title',
    defaultMessage: 'No Card Entry',
  },
  nextOpen: {
    id: 'Lobby.CompetitionList.NoCardEntry.nextOpen',
    defaultMessage: 'Opens in {time}',
  },
  nextClose: {
    id: 'Lobby.CompetitionList.NoCardEntry.nextClose',
    defaultMessage: 'Closes in {time}',
  },
});

const DEFAULT_SO5_GAME_WEEK_POOL_COMPOSITION = {
  gameWeek: 373,
  limited: 960321,
  rare: 294849,
  superRare: 29925,
  unique: 2970,
};

const NoCardEntry = () => {
  const [mainDialogOpened, setMainDialogOpened] = useState(false);
  const [infoDialogOpened, setInfoDialogOpened] = useState(false);
  const {
    so5: {
      noCardRoute: { nextOpenDate, nextCloseDate },
    },
  } = useConfigContext();
  const { currentUser } = useCurrentUserContext();
  const {
    flags: { so5GameWeekPoolComposition = {} },
  } = useFeatureFlags();

  const so5GameWeekPoolCompositionToDisplay =
    Object.keys(so5GameWeekPoolComposition).length > 0
      ? so5GameWeekPoolComposition
      : DEFAULT_SO5_GAME_WEEK_POOL_COMPOSITION;

  const onMainDialogClose = () => setMainDialogOpened(false);
  const onInfoDialogClose = () => setInfoDialogOpened(false);

  if (!currentUser?.noCardRouteEnabled) return null;

  const { so5NoCardRouteOpened } = currentUser;
  const showOpensIn = !!nextOpenDate && new Date(nextOpenDate) > new Date();
  const showCloseIn =
    !showOpensIn && !!nextCloseDate && new Date(nextCloseDate) > new Date();

  return (
    <>
      <Root>
        <Text16 bold as="div">
          <Title>
            <FormattedMessage {...messages.title} />
            <Caption
              as="button"
              onClick={() => setInfoDialogOpened(true)}
              type="button"
            >
              <Info />
            </Caption>
          </Title>
          {(showOpensIn || showCloseIn) && (
            <TimeLeftWrapper
              as="div"
              className={classnames({ closing: showCloseIn })}
            >
              <FontAwesomeIcon icon={faClock} />
              {showOpensIn && (
                <FormattedMessage
                  {...messages.nextOpen}
                  values={{ time: <TimeLeft time={new Date(nextOpenDate)} /> }}
                />
              )}
              {showCloseIn && (
                <FormattedMessage
                  {...messages.nextClose}
                  values={{ time: <TimeLeft time={new Date(nextCloseDate)} /> }}
                />
              )}
            </TimeLeftWrapper>
          )}
        </Text16>
        <Cta>
          <Button
            small
            fullWidth
            disabled={!so5NoCardRouteOpened}
            color={so5NoCardRouteOpened ? 'blue' : 'darkGray'}
            onClick={() => setMainDialogOpened(true)}
          >
            <FormattedMessage
              id="Lobby.CompetitionList.NoCardEntry.cta"
              defaultMessage="Register"
            />
          </Button>
        </Cta>
      </Root>
      <So5NoCardEntryRegisterDialog
        open={mainDialogOpened}
        onClose={onMainDialogClose}
      />
      <NoCardEntryInfoDialog
        open={infoDialogOpened}
        onClose={onInfoDialogClose}
        poolDetail={
          <FormattedMessage
            id="Lobby.CompetitionList.NoCardEntry.poolDetail"
            defaultMessage="For instance, for Game Week {gameWeek}, the pool of players available was composed of {limitedCount} Limited Cards, {rareCount} Rare Cards, {superRareCount} Super Rare Cards, {uniqueCount} Unique Cards."
            values={{
              gameWeek: so5GameWeekPoolCompositionToDisplay.gameWeek,
              limitedCount: so5GameWeekPoolCompositionToDisplay.limited,
              rareCount: so5GameWeekPoolCompositionToDisplay.rare,
              superRareCount: so5GameWeekPoolCompositionToDisplay.superRare,
              uniqueCount: so5GameWeekPoolCompositionToDisplay.unique,
            }}
          />
        }
      />
    </>
  );
};

export default NoCardEntry;
