import { TypedDocumentNode, gql } from '@apollo/client';
import { faRocketLaunch, faTrophy } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import { fantasy } from '@sorare/core/src/lib/glossary';

import { PrivateUserGroupRanking_userGroup } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  gap: var(--double-unit);
  &.fullWidth {
    width: 100%;
    justify-content: space-between;
  }
`;
const StatsBlock = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const RankingScore = styled.div`
  display: inline-flex;
  align-items: center;
`;
const MembersCount = styled(Text14)`
  color: var(--c-neutral-600);
`;

type Props = {
  group: PrivateUserGroupRanking_userGroup;
  fullWidth?: boolean;
};
const PrivateUserGroupRanking = ({
  group: { myMembership, membershipsCount: count },
  fullWidth,
}: Props) => {
  const score = myMembership?.score;

  return (
    <Root className={classnames({ fullWidth })}>
      <StatsBlock>
        <FontAwesomeIcon
          icon={faTrophy}
          color="var(--c-neutral-600)"
          size="xs"
        />
        <RankingScore>
          <Text14 color="var(--c-neutral-900)" bold>
            {myMembership?.ranking}
          </Text14>
          <MembersCount>/{count}</MembersCount>
        </RankingScore>
      </StatsBlock>
      <StatsBlock>
        <FontAwesomeIcon
          icon={faRocketLaunch}
          color="var(--c-neutral-600)"
          size="xs"
        />
        <Text14 color="var(--c-neutral-900)" bold>
          <FormattedMessage {...fantasy.points} values={{ score }} />
        </Text14>
      </StatsBlock>
    </Root>
  );
};

export default PrivateUserGroupRanking;

PrivateUserGroupRanking.fragments = {
  vicc5UserGroup: gql`
    fragment PrivateUserGroupRanking_userGroup on Vicc5UserGroup {
      slug
      membershipsCount
      myMembership {
        id
        ranking
        score
      }
    }
  ` as TypedDocumentNode<PrivateUserGroupRanking_userGroup>,
};
