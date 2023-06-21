import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  CardQuality,
  Rarity,
  ReferralState,
  Sport,
} from '@core/__generated__/globalTypes';
import { RainbowBox } from '@core/atoms/layout/RainbowBox';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text18, Title3 } from '@core/atoms/typography';
import CardBack from '@core/components/card/Back';
import useQuery from '@core/hooks/graphql/useQuery';
import { qualityNames } from '@core/lib/players';
import { CARDS_REQUIREMENTS_BY_SPORT } from '@core/lib/referral';
import { scarcityMessages } from '@core/lib/scarcity';

import { Milestones } from '../Milestones';
import { messages } from '../messages';
import { CardContainer, TextContent } from '../ui';
import {
  MilestonesReferralQuery,
  MilestonesReferralQueryVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const DesignBlock = styled(RainbowBox)`
  display: flex;
  justify-content: space-between;
  gap: var(--double-unit);
  padding: var(--triple-unit) calc(7 * var(--unit)) var(--triple-unit)
    var(--triple-unit);

  --border: var(--c-gradient-limited);
  --inside: linear-gradient(99.55deg, #9025a2 0%, #001f8d 100%);

  border-width: 2px;
  border-radius: var(--double-unit);
`;

export const MILESTONES_REFERRAL_QUERY = gql`
  query MilestonesReferralQuery($state: ReferralState, $sport: Sport!) {
    currentUser {
      slug
      referrals(state: $state, sport: $sport) {
        id
        totalCount
      }
      referralMilestoneRewards(sport: $sport) {
        referralNumber
        ...Milestones_referralMilestoneReward
      }
    }
  }
  ${Milestones.fragments.ReferralMilestoneReward}
`;

export const MilestonesNotice = ({ sport }: { sport: Sport }) => {
  const { data, loading } = useQuery<
    MilestonesReferralQuery,
    MilestonesReferralQueryVariables
  >(MILESTONES_REFERRAL_QUERY, {
    variables: {
      state: ReferralState.COMPLETED,
      sport,
    },
  });

  return (
    <Root>
      <DesignBlock>
        <TextContent>
          <Title3>
            <FormattedMessage
              {...messages.description}
              values={{ count: CARDS_REQUIREMENTS_BY_SPORT[sport] }}
            />
            {sport === Sport.BASEBALL && '*'}
          </Title3>
          {sport === Sport.BASEBALL ? (
            <Text18>
              <FormattedMessage
                id="Notice.MilestonesNotice.maxiumRewards"
                defaultMessage="* Maximum of 3 rewards"
              />
            </Text18>
          ) : (
            <Text18>
              <FormattedMessage {...scarcityMessages.limited} />{' '}
              <b>{qualityNames[CardQuality.TIER_3]}</b>
            </Text18>
          )}
        </TextContent>
        <CardContainer>
          <CardBack rarity={Rarity.limited} />
        </CardContainer>
      </DesignBlock>
      {loading ? (
        <LoadingIndicator small />
      ) : (
        <Milestones
          sport={sport}
          currentProgression={data?.currentUser?.referrals.totalCount || 0}
          milestones={data?.currentUser?.referralMilestoneRewards || []}
        />
      )}
    </Root>
  );
};
