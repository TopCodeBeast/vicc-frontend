import { gql } from '@apollo/client';
import { faRocketLaunch, faTrophy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, text14 } from '@sorare/core/src/atoms/typography';
import { fantasy } from '@sorare/core/src/lib/glossary';

import { UserGroupRanking_userGroup } from './__generated__/index.graphql';

const Rankings = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--double-unit);
`;

const StatsBlock = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--half-unit);
  ${text14}
`;

const RankingScore = styled.div`
  display: inline-flex;
  align-items: center;
`;

const MembersCount = styled(Text14)`
  color: var(--c-neutral-600);
`;

type Props = { group: UserGroupRanking_userGroup; className?: string };

const UserGroupRanking = ({
  group: { myMembership, membershipsCount: count },
  className,
}: Props) => {
  const score = myMembership?.score;
  if (!score) return null;

  return (
    <Rankings className={className}>
      <StatsBlock>
        <FontAwesomeIcon
          icon={faTrophy}
          color="var(--c-neutral-600)"
          size="xs"
        />
        <RankingScore>
          <strong>{myMembership?.ranking}</strong>
          <MembersCount>/{count}</MembersCount>
        </RankingScore>
      </StatsBlock>
      <StatsBlock>
        <FontAwesomeIcon
          icon={faRocketLaunch}
          color="var(--c-neutral-600)"
          size="xs"
        />
        <strong>
          <FormattedMessage {...fantasy.points} values={{ score }} />
        </strong>
      </StatsBlock>
    </Rankings>
  );
};

export default UserGroupRanking;

UserGroupRanking.fragments = {
  userGroup: gql`
    fragment UserGroupRanking_userGroup on So5UserGroup {
      slug
      membershipsCount
      myMembership {
        id
        ranking
        score
      }
    }
  `,
};
