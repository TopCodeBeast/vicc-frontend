import { TypedDocumentNode, gql } from '@apollo/client';
import { faBaseball, faBasketball } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Ball } from '@core/atoms/icons/Ball';
import { Text14 } from '@core/atoms/typography';
import useDestroyReferral from '@core/hooks/referral/useDestroyReferral';
import { glossary } from '@core/lib/glossary';
import { CARDS_REQUIREMENTS_BY_SPORT } from '@core/lib/referral';

import { ReferralStatus_referral } from './__generated__/index.graphql';

const Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--unit);
  color: var(--c-neutral-1000);
`;
const Icon = styled.span`
  font: var(--t-12);
`;
const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

type ProgressionProps = {
  count: number;
  max?: number | null;
  icon?: ReactNode;
  sport: Sport;
};

const Progression = ({ count, icon, max, sport }: ProgressionProps) => {
  const target = max || CARDS_REQUIREMENTS_BY_SPORT[sport];

  return (
    <Progress>
      <Text14>
        <FormattedMessage
          id="ReferralBar.count"
          defaultMessage="{count} out of {max}"
          values={{ count: count < target ? count : target, max: target }}
        />
      </Text14>
      <Icon>{icon}</Icon>
    </Progress>
  );
};

type Props = {
  referral: ReferralStatus_referral;
  cardsRequirements?: number | null;
};

const SportLogo = ({ sport }: { sport: Sport }) => {
  if (sport === Sport.FOOTBALL) {
    return <Ball />;
  }
  if (sport === Sport.NBA) {
    return <FontAwesomeIcon icon={faBasketball} />;
  }
  return <FontAwesomeIcon icon={faBaseball} />;
};

const StyledText14 = styled(Text14)`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

export const ReferralStatus = ({ referral, cardsRequirements }: Props) => {
  const destroyReferral = useDestroyReferral();
  const { referrerReward } = referral;
  if (referrerReward) {
    return (
      <StyledText14 bold color="var(--c-green-800)">
        <FormattedMessage {...glossary.completed} />
        <SportLogo sport={referral.sport!} />
      </StyledText14>
    );
  }

  if (referral.aasmState === 'expired') {
    return (
      <Button
        color="red"
        small
        onClick={() => {
          destroyReferral(referral.id);
        }}
      >
        <FormattedMessage {...glossary.delete} />
      </Button>
    );
  }

  if (referral.refereeInvitationSentAt && !referral.refereeConfirmedAt)
    return (
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage
          id="ReferralStatus.unconfirmed"
          defaultMessage="Unconfirmed"
        />
      </Text14>
    );

  return (
    <ProgressContainer>
      {!referral.footballCardsAuctionCount &&
        !referral.nbaCardsAuctionCount &&
        !referral.baseballCardsAuctionCount && (
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ReferralStatus.noCardsCollected"
              defaultMessage="No cards collected"
            />
          </Text14>
        )}
      {!!referral.footballCardsAuctionCount && (
        <Progression
          icon={<SportLogo sport={Sport.FOOTBALL} />}
          count={referral.footballCardsAuctionCount}
          max={cardsRequirements}
          sport={Sport.FOOTBALL}
        />
      )}
      {!!referral.nbaCardsAuctionCount && (
        <Progression
          icon={<SportLogo sport={Sport.NBA} />}
          count={referral.nbaCardsAuctionCount}
          sport={Sport.NBA}
        />
      )}
      {!!referral.baseballCardsAuctionCount && (
        <Progression
          icon={<SportLogo sport={Sport.BASEBALL} />}
          count={referral.baseballCardsAuctionCount}
          sport={Sport.BASEBALL}
        />
      )}
    </ProgressContainer>
  );
};

ReferralStatus.fragments = {
  referral: gql`
    fragment ReferralStatus_referral on Referral {
      id
      aasmState
      sport
      footballCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
        sport: FOOTBALL
      )
      nbaCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
        sport: NBA
      )
      baseballCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
        sport: BASEBALL
      )
      refereeInvitationSentAt
      refereeConfirmedAt
      referrerReward {
        id
      }
    }
  ` as TypedDocumentNode<ReferralStatus_referral>,
};
