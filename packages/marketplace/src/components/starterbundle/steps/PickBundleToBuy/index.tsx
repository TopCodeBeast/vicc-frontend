import { ReactNode, useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useInterval } from 'react-use';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import { TimeUntilNext } from '@sorare/core/src/atoms/ticker/TimeUntilNext';
import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { Header } from '@marketplace/components/starterbundle/Layout/Header';
import {
  TransactionStatus,
  TransactionStatusDialog,
} from '@marketplace/components/starterbundle/TransactionStatusDialog';
import { useMarketplaceEvents } from '@marketplace/lib/events';

const messages = defineMessages({
  timeLeft: {
    id: 'StarterBundle.expiresIn',
    defaultMessage: 'This offer expires in {timeLeft}',
  },
});
const Bundles = styled.div`
  margin: 0 var(--double-unit);
  display: flex;
  gap: var(--double-unit);
  flex-direction: column;
  > * {
    flex: 1;
  }

  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;

const TimeUntilNextStyled = styled(TimeUntilNext)`
  display: inline-flex;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const ConversionCreditBannerContainer = styled.div`
  margin: 0 var(--double-unit);
`;

type Props = {
  sport: Sport;
  bundleOptions: string[] | undefined;
  renderBundle: (bundleId: string, props: any) => ReactNode;
  composeLineupRoute: string | undefined;
  tournamentNameToJoin: string;
  submit: (bundleId: string) => Promise<void>;
  isUserEligible: boolean;
  getUserEligible: () => Promise<void>;
  expiresIn: Date;
  footer?: ReactNode;
};

export const PickBundleToBuy = ({
  sport,
  bundleOptions = [],
  composeLineupRoute,
  renderBundle,
  isUserEligible,
  getUserEligible,
  expiresIn,
  tournamentNameToJoin,
  footer,
}: Props) => {
  const { formatMessage } = useIntl();
  const [status, setStatus] = useState<TransactionStatus>('not_started');
  const [fetchCount, setFetchCount] = useState(0);
  const [runFetch, setRunFetch] = useState(false);
  const navigate = useNavigate();
  const track = useMarketplaceEvents();

  useInterval(
    () => {
      getUserEligible();
      setFetchCount(oldCount => oldCount + 1);
      if (fetchCount >= 5) {
        setRunFetch(false);
        setStatus('error');
      }
    },
    runFetch ? fetchCount * 2000 : null
  );

  useEffect(() => {
    track('Starter Bundles Dialog Open', {
      sport,
    });
  }, [sport, track]);

  useEffect(() => {
    if (isUserEligible) {
      setRunFetch(false);
      setStatus('complete');
    }
  }, [isUserEligible]);

  return (
    <>
      <Container>
        <Header
          title={formatMessage({
            id: 'PickBundleToBuy.title3',
            defaultMessage: 'Limited time offer',
          })}
          subtitle={formatMessage(
            {
              id: 'StarterBundle.subtitle4',
              defaultMessage:
                "Scouting 5 Limited Cards to join your first Limited tournament isn’t easy.{br}To make it easier, we've curated 2 packs that performed well in the last Game Week.{br}{expiresIn}",
            },
            {
              br: <br />,
              expiresIn: (
                <TimeUntilNextStyled
                  timeLeftMessage={messages.timeLeft}
                  next={expiresIn}
                />
              ),
            }
          )}
        />
        <Content>
          <ConversionCreditBannerContainer>
            <ConversionCreditBanner sport={sport} rounded />
          </ConversionCreditBannerContainer>
          <Bundles>
            {bundleOptions.map(bundleId =>
              renderBundle(bundleId, {
                onPaymentSuccess: () => {
                  setRunFetch(true);
                  setStatus('processing');
                },
              })
            )}
          </Bundles>
        </Content>

        {footer}
      </Container>

      {status !== 'not_started' && (
        <TransactionStatusDialog
          sport={sport}
          status={status}
          tournamentNameToJoin={tournamentNameToJoin}
          onSuccess={() => composeLineupRoute && navigate(composeLineupRoute)}
          onError={() => {
            setFetchCount(0);
            setStatus('not_started');
          }}
          onClose={() => {
            setStatus('not_started');
          }}
        />
      )}
    </>
  );
};
