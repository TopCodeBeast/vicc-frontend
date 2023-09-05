import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { isFixtureClosed } from '@football/lib/so5';

import { CompetitionDetailsTimeLeft_vicc5Fixture } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: none;
  @media ${laptopAndAbove} {
    display: inline-flex;
    align-items: center;
    padding: var(--half-unit) 0;
    border-radius: var(--quadruple-unit);
  }
`;

const getLabel = (vicc5Fixture: CompetitionDetailsTimeLeft_vicc5Fixture) => {
  const startDate = parseISO(vicc5Fixture.cutOffDate);
  const endDate = parseISO(vicc5Fixture.endDate);

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

type Props = { vicc5Fixture: CompetitionDetailsTimeLeft_vicc5Fixture };

export const CompetitionDetailsTimeLeft = ({ vicc5Fixture }: Props) => {
  if (isFixtureClosed(vicc5Fixture)) {
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
        label={getLabel(vicc5Fixture)}
      />
    </Wrapper>
  );
};

CompetitionDetailsTimeLeft.fragments = {
  vicc5Fixture: gql`
    fragment CompetitionDetailsTimeLeft_vicc5Fixture on Vicc5Fixture {
      slug
      endDate
      aasmState
      cutOffDate
    }
  ` as TypedDocumentNode<CompetitionDetailsTimeLeft_vicc5Fixture>,
};
