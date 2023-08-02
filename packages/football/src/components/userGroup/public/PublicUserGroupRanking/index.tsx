import { TypedDocumentNode, gql } from '@apollo/client';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';

import { Rewards } from '@football/components/lineup/Rewards';

import { PublicUserGroupRanking_so5UserGroup } from './__generated__/index.graphql';

const Root = styled.div`
  width: 100%;
  display: flex;
  gap: var(--unit);
  justify-content: space-between;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const RewardsContainer = styled.div`
  position: relative;
  padding: 0 var(--half-unit);
  overflow-x: auto;
  mask-image: linear-gradient(90deg, black 97%, transparent 100%);
`;

type Props = {
  so5UserGroup: PublicUserGroupRanking_so5UserGroup;
  hideRewards?: boolean;
};
const PublicUserGroupRanking = ({ so5UserGroup, hideRewards }: Props) => {
  if (!so5UserGroup) {
    return null;
  }

  return (
    <Root>
      <FlexContainer>
        <FontAwesomeIcon
          icon={faUser}
          size="2xs"
          color="var(--c-neutral-1000)"
        />
        <Text14 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="PublicUserGroupRanking.memberships"
            defaultMessage="<b>{myRank}</b>/{ranksCount}"
            values={{
              b: Bold,
              myRank: so5UserGroup.myMembership?.ranking || '-',
              ranksCount: so5UserGroup.membershipsCount,
            }}
          />
        </Text14>
      </FlexContainer>
      {!hideRewards && (
        <RewardsContainer className="hiddenScrollbars">
          <Rewards
            rewards={so5UserGroup.totalRewards}
            hideExperienceDescription
          />
        </RewardsContainer>
      )}
    </Root>
  );
};

PublicUserGroupRanking.fragments = {
  so5UserGroup: gql`
    fragment PublicUserGroupRanking_so5UserGroup on So5UserGroup {
      id
      membershipsCount
      totalRewards {
        ...Rewards_rewardsOverview
      }
      myMembership {
        id
        ranking
      }
    }
    ${Rewards.fragments.reward}
  ` as TypedDocumentNode<PublicUserGroupRanking_so5UserGroup>,
};

export default PublicUserGroupRanking;
