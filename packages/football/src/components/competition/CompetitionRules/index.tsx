import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import { groupBy } from '@sorare/core/src/lib/arrays';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Eligibilities from '@football/components/competition/CompetitionRules/Eligibilities';
import { LockedCompetitionAction } from '@football/components/competition/LockedCompetitionAction';
// import { formatRules } from '@football/components/so5/Rules/formatRules';

import RuleSection from './RuleSection';
import { CompetitionRules_vicc5Leaderboard } from './__generated__/index.graphql';

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
  vicc5Leaderboard: CompetitionRules_vicc5Leaderboard;
};

const CompetitionRules = ({ vicc5Leaderboard }: Props) => {
  /*const intl = useIntl();

  const { description } = vicc5Leaderboard;
  const formattedRules = formatRules(vicc5Leaderboard, [], intl);

  const ruleSections = groupBy(
    rule => rule.title?.id || rule.id,
    formattedRules.filter(rule => rule.defaultMessage)
  );

  return (
    <Wrapper>
      <div>
        <Title5 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Lobby.CompetitionDetails.tournamentRules"
            defaultMessage="Tournament Rules"
          />
        </Title5>
        <Text16 color="var(--c-neutral-600)">{description}</Text16>
      </div>
      <RulesSectionWrapper>
        <LockedCompetitionAction
          vicc5Leaderboard={vicc5Leaderboard}
          Wrapper={DesktopLockedCompetitionAction}
        />
        {Object.entries(ruleSections).map(([id, rules]) => {
          return (
            <RuleSection
              key={id}
              rules={rules}
              vicc5Leaderboard={vicc5Leaderboard}
            />
          );
        })}
        <Eligibilities vicc5Leaderboard={vicc5Leaderboard} />
      </RulesSectionWrapper>
    </Wrapper>
  );*/

  return <>CompetitionRules5</>;
};

/*CompetitionRules.fragments = {
  vicc5Leaderboard: gql`
    fragment CompetitionRules_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      description
      ...formatRules_vicc5Leaderboard
      ...Eligibilities_vicc5Leaderboard
      ...RuleSection_vicc5Leaderboard
      ...LockedCompetitionAction_vicc5Leaderboard
    }
    ${formatRules.fragments.vicc5Leaderboard}
    ${Eligibilities.fragments.vicc5Leaderboard}
    ${RuleSection.fragments.vicc5Leaderboard}
    ${LockedCompetitionAction.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<CompetitionRules_vicc5Leaderboard>,
};*/

export default CompetitionRules;
