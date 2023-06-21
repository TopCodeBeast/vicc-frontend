import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import { isFixtureClosed } from '@football/lib/so5';

import { CompetitionDetailsTimeLeft_so5Fixture } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: none;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: inline-flex;
    align-items: center;
    padding: var(--half-unit) 0;
    border-radius: ${theme.radius.chip};
  }
`;

const getLabel = (so5Fixture: CompetitionDetailsTimeLeft_so5Fixture) => {
  const startDate = parseISO(so5Fixture.cutOffDate);
  const endDate = parseISO(so5Fixture.endDate);

  if (isPast(endDate)) {
    return <FormattedMessage {...fantasy.ended} />;
  }
  if (isPast(startDate)) {
    return <FormattedMessage {...fantasy.live} />;
  }
  return (
    <FormattedMessage
      id="Lobby.Upcoming.GW.timeleft"
      defaultMessage="Starts in {timeleft}"
      values={{
        timeleft: (
          <TimeLeft
            time={startDate}
            Layout={({ children }) => <span>{children}</span>}
          />
        ),
      }}
    />
  );
};

type Props = { so5Fixture: CompetitionDetailsTimeLeft_so5Fixture };

export const CompetitionDetailsTimeLeft = ({ so5Fixture }: Props) => {
  if (isFixtureClosed(so5Fixture)) {
    return null;
  }

  return (
    <Wrapper>
      <Chip
        custom={{
          color: 'var(--c-static-neutral-100)',
          background: 'var(--c-static-neutral-800)',
        }}
        size="smaller"
        label={getLabel(so5Fixture)}
      />
    </Wrapper>
  );
};

CompetitionDetailsTimeLeft.fragments = {
  so5Fixture: gql`
    fragment CompetitionDetailsTimeLeft_so5Fixture on So5Fixture {
      slug
      endDate
      aasmState
      cutOffDate
    }
  `,
};
