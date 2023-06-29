import { gql } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import { groupBy } from '@sorare/core/src/lib/arrays';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { formatRules } from '@football/components/so5/Rules/formatRules';
import Eligibilities from '@football/pages/Lobby/CompetitionDetails/Details/CompetitionRules/Eligibilities';
import { LockedCompetitionAction } from '@football/pages/Lobby/CompetitionDetails/Details/LockedCompetitionAction';

import RuleSection from './RuleSection';
import { CompetitionRules_so5Leaderboard } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const RulesSectionWrapper = styled.div`
  background: var(--c-neutral-300);
  border-radius: var(--double-unit);
  padding: var(--double-unit);
  @media ${laptopAndAbove} {
    padding: var(--double-unit) var(--triple-unit);
  }
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  & > *:not(:last-child) {
    position: relative;
    & > *:after {
      content: '';
      height: 1px;
      background: var(--c-neutral-400);
      position: absolute;
      bottom: calc(-2 * var(--unit));
      left: 0;
      right: 0;
    }
  }
`;

const DesktopLockedCompetitionAction = styled.div`
  display: none;
  @media ${laptopAndAbove} {
    display: block;
  }
`;

type Props = {
  so5Leaderboard: CompetitionRules_so5Leaderboard;
};

const CompetitionRules = ({ so5Leaderboard }: Props) => {
  const intl = useIntl();

  const { description } = so5Leaderboard;
  const formattedRules = formatRules(so5Leaderboard, [], intl);

  const ruleSections = groupBy(
    rule => rule.title?.id || rule.id,
    formattedRules.filter(rule => rule.defaultMessage)
  );

  return (
    <Wrapper>
      <div>
        <Title5>
          <FormattedMessage
            id="Lobby.CompetitionDetails.tournamentRules"
            defaultMessage="Tournament Rules"
          />
        </Title5>
        <Text16 color="var(--c-neutral-600)">{description}</Text16>
      </div>
      <RulesSectionWrapper>
        <LockedCompetitionAction
          so5Leaderboard={so5Leaderboard}
          Wrapper={DesktopLockedCompetitionAction}
        />
        {Object.entries(ruleSections).map(([id, rules]) => {
          return (
            <RuleSection
              key={id}
              rules={rules}
              so5Leaderboard={so5Leaderboard}
            />
          );
        })}
        <Eligibilities so5Leaderboard={so5Leaderboard} />
      </RulesSectionWrapper>
    </Wrapper>
  );
};

CompetitionRules.fragments = {
  so5Leaderboard: gql`
    fragment CompetitionRules_so5Leaderboard on So5Leaderboard {
      slug
      description
      ...formatRules_so5Leaderboard
      ...Eligibilities_so5Leaderboard
      ...RuleSection_so5Leaderboard
      ...LockedCompetitionAction_so5Leaderboard
    }
    ${formatRules.fragments.so5Leaderboard}
    ${Eligibilities.fragments.so5Leaderboard}
    ${RuleSection.fragments.so5Leaderboard}
    ${LockedCompetitionAction.fragments.so5Leaderboard}
  `,
};

export default CompetitionRules;
