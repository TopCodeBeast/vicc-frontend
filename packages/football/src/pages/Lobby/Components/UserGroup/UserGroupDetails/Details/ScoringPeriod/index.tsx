import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text18, Title3 } from '@sorare/core/src/atoms/typography';

import { GetUserGroupDetailsTabQuery } from '@football/pages/Lobby/Components/UserGroup/UserGroupDetails/Details/__generated__/index.graphql';

type GetUserGroupDetailsTabQuery_so5_so5UserGroup =
  GetUserGroupDetailsTabQuery['football']['so5']['so5UserGroup'];

export const Section = styled.div`
  padding-top: calc(3 * var(--unit));
  &:not(:first-of-type) {
    border-top: 1px solid var(--c-neutral-300);
  }
  &:not(:last-of-type) {
    padding-bottom: calc(3 * var(--unit));
  }
`;

export const SectionTitle = styled(Text18)<{ noMargin?: boolean }>`
  font-weight: var(--t-bold);
  margin-bottom: ${props => (props.noMargin ? 0 : 'var(--double-unit)')};
`;

const ContentBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--unit);
`;

type Props = {
  group: GetUserGroupDetailsTabQuery_so5_so5UserGroup;
};
const ScoringPeriod = ({ group }: Props) => {
  const { formatMessage } = useIntl();

  const getGameWeekLabel = (gameWeek: number) =>
    formatMessage(
      {
        id: 'UserGroupDetails.Details.GameWeek',
        defaultMessage: 'Game Week {number}',
      },
      {
        number: gameWeek,
      }
    );

  const { startGameWeek, endGameWeek, startSo5Fixture, endSo5Fixture } = group;

  return (
    <>
      <Section>
        <SectionTitle noMargin>
          <FormattedMessage
            id="UserGroupDetails.Details.StartScoring"
            defaultMessage="Scoring starts"
          />
        </SectionTitle>
        <ContentBlock>
          <Title3>
            {startSo5Fixture?.displayName || getGameWeekLabel(startGameWeek)}
          </Title3>
          {startSo5Fixture && (
            <FormattedDate
              value={startSo5Fixture.startDate}
              day="2-digit"
              month="short"
            />
          )}
        </ContentBlock>

        {group?.upcomingSo5Leaderboard &&
          (startSo5Fixture?.displayName ? (
            <FormattedMessage
              id="UserGroupDetails.Details.Explanation"
              defaultMessage="Points will accumulate every game week starting from {fixtureName}, based on the points you score in the following tournament: {tournament}."
              values={{
                tournament: group?.upcomingSo5Leaderboard?.displayName,
                fixtureName: startSo5Fixture?.displayName,
              }}
            />
          ) : (
            <FormattedMessage
              id="UserGroupDetails.Details.ExplanationWithoutFixtureName"
              defaultMessage="Points will accumulate every game week starting from Game Week {startGameWeek}, based on the points you score in the following tournament: {tournament}."
              values={{
                tournament: group?.upcomingSo5Leaderboard?.displayName,
                startGameWeek,
              }}
            />
          ))}
      </Section>
      {typeof endGameWeek === 'number' && (
        <Section>
          <SectionTitle noMargin>
            <FormattedMessage
              id="UserGroupDetails.Details.EndScoring"
              defaultMessage="Scoring ends"
            />
          </SectionTitle>

          <ContentBlock>
            <Title3>
              {endSo5Fixture?.displayName || getGameWeekLabel(endGameWeek)}
            </Title3>
            {endSo5Fixture && (
              <FormattedDate
                value={endSo5Fixture.endDate}
                day="2-digit"
                month="short"
              />
            )}
          </ContentBlock>
        </Section>
      )}
    </>
  );
};

export default ScoringPeriod;
