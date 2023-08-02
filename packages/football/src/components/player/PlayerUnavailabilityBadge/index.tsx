import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Injured } from '@sorare/core/src/atoms/icons/Injured';
import { Suspended } from '@sorare/core/src/atoms/icons/Suspended';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import { playerUnavailability } from '@sorare/core/src/lib/glossary';

import {
  PlayerUnavailabilityBadge_injury,
  PlayerUnavailabilityBadge_suspension,
} from './__generated__/index.graphql';

const UnavailabiltyWrapper = styled.span`
  display: flex;
  gap: var(--half-unit);
`;

const InjuredIcon = styled(Injured)`
  color: var(--c-red-600);
`;
const SuspendedIcon = styled(Suspended)`
  color: var(--c-red-600);
`;

type Props = {
  injuries: PlayerUnavailabilityBadge_injury[];
  suspensions: PlayerUnavailabilityBadge_suspension[];
};
export const PlayerUnavailabilityBadge = ({ injuries, suspensions }: Props) => {
  if (!injuries.length && !suspensions.length) return null;

  return (
    <UnavailabiltyWrapper>
      {injuries.length > 0 && (
        <Tooltip
          title={
            <>
              <Title6>
                <FormattedMessage {...playerUnavailability.injuryTitle} />
              </Title6>
              {injuries.map(injury => (
                <div key={`${injury.startDate}-${injury.kind}`}>
                  <Text14>
                    {injury.kind}
                    {injury.startDate && (
                      <>
                        {' '}
                        <FormattedMessage
                          {...playerUnavailability.unavailableSince}
                          values={{
                            unavailableSince: new Date(injury.startDate),
                          }}
                        />
                      </>
                    )}
                  </Text14>
                  <Text14>
                    {injury.expectedEndDate ? (
                      <FormattedMessage
                        {...playerUnavailability.expectedReturnDate}
                        values={{
                          date: new Date(injury.expectedEndDate),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        {...playerUnavailability.unknownReturnDate}
                      />
                    )}
                  </Text14>
                </div>
              ))}
            </>
          }
        >
          <InjuredIcon />
        </Tooltip>
      )}
      {suspensions.length > 0 && (
        <Tooltip
          title={
            <>
              <Title6>
                <FormattedMessage {...playerUnavailability.suspendedTitle} />
              </Title6>
              {suspensions.map(suspension => (
                <div key={`${suspension.startDate}-${suspension.reason}`}>
                  <Text14>
                    {suspension.reason}
                    {suspension.matches && (
                      <>
                        {' '}
                        <FormattedMessage
                          {...playerUnavailability.gamesUnavailableCount}
                          values={{
                            gamesCount: suspension.matches,
                            competition: suspension.competition.displayName,
                          }}
                        />
                      </>
                    )}
                  </Text14>
                  <Text14>
                    {suspension.endDate ? (
                      <FormattedMessage
                        {...playerUnavailability.expectedReturnDate}
                        values={{
                          date: new Date(suspension.endDate),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        {...playerUnavailability.unknownReturnDate}
                      />
                    )}
                  </Text14>
                </div>
              ))}
            </>
          }
        >
          <SuspendedIcon />
        </Tooltip>
      )}
    </UnavailabiltyWrapper>
  );
};

PlayerUnavailabilityBadge.fragments = {
  suspension: gql`
    fragment PlayerUnavailabilityBadge_suspension on Suspension {
      id
      competition {
        slug
        id
        displayName
      }
      matches
      reason
      startDate
      endDate
    }
  ` as TypedDocumentNode<PlayerUnavailabilityBadge_suspension>,
  injury: gql`
    fragment PlayerUnavailabilityBadge_injury on Injury {
      id
      kind
      startDate
      expectedEndDate
    }
  ` as TypedDocumentNode<PlayerUnavailabilityBadge_injury>,
};

export default PlayerUnavailabilityBadge;
