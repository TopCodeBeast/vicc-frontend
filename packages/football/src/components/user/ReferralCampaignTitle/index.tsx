import { gql } from '@apollo/client';
import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Button, {
  Props as ButtonProps,
} from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Caption, Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { qualityNames } from '@sorare/core/src/lib/players';
import { CARDS_REQUIREMENTS_BY_SPORT } from '@sorare/core/src/lib/referral';

import TeamAvatar from '@sorare/football/src/components/club/TeamAvatar';
import CompetitionLogo from '@sorare/football/src/components/competition/CompetitionLogo';

import { ReferralCampaignTitle_referralCampaign } from './__generated__/index.graphql';

interface CampaignDialogProps {
  referralCampaign: ReferralCampaignTitle_referralCampaign;
  onClose: () => void;
}

interface Props {
  referralCampaign: ReferralCampaignTitle_referralCampaign | null;
  ctaProps?: ButtonProps;
}

const messages = defineMessages({
  dialogTitle: {
    id: 'CampaignDetailsDialog.title',
    defaultMessage: 'About the event',
  },
  specialEventTitle: {
    id: 'CampaignDetails.specialEventTitle',
    defaultMessage: 'Referral event',
  },
  specialEventUntil: {
    id: 'CampaignDetails.specialEventUntil',
    defaultMessage: '{icon} From {startDate} to {endDate}',
  },
  requiredCards: {
    id: 'CampaignDetails.requiredCards',
    defaultMessage: '{cardsCount} required Cards',
  },
});

const Requirements = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  & > *:last-child {
    text-decoration: line-through;
  }
`;

const CampaignTitle = ({
  startDate,
  endDate,
  cardsCount,
}: {
  startDate: string;
  endDate: string;
  cardsCount: number | null | undefined;
}) => {
  const { formatDate } = useIntlContext();

  return (
    <>
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage
          {...messages.specialEventUntil}
          values={{
            icon: <FontAwesomeIcon icon={faClock} />,
            startDate: formatDate(parseISO(startDate), {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
            endDate: formatDate(parseISO(endDate), {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
          }}
        />
      </Text14>
      <Text16 bold>
        <FormattedMessage {...messages.specialEventTitle} />
      </Text16>
      {(cardsCount || 0) > 0 && (
        <Requirements>
          <Text14 color="var(--c-red-600)">
            <FormattedMessage
              {...messages.requiredCards}
              values={{
                cardsCount,
              }}
            />
          </Text14>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              {...messages.requiredCards}
              values={{
                cardsCount: CARDS_REQUIREMENTS_BY_SPORT[Sport.FOOTBALL],
              }}
            />
          </Text14>
        </Requirements>
      )}
    </>
  );
};

const DialogRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const Chip = styled.div`
  background: var(--c-neutral-200);
  color: var(--c-neutral-1000);
  padding: var(--half-unit) var(--unit);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const DialogLink = styled.a`
  text-align: right;
`;

const CampaignDetailsDialog = ({
  referralCampaign,
  onClose,
}: CampaignDialogProps) => {
  const { formatMessage } = useIntl();
  const { competitions, teams, tiers, playerPoolUrl } = referralCampaign;

  return (
    <Dialog open onClose={onClose} title={formatMessage(messages.dialogTitle)}>
      <DialogRoot>
        <CampaignTitle {...referralCampaign} />
        <Text14>
          <FormattedMessage
            id="CampaignDetailsDialog.details"
            defaultMessage="Referrer and referee will get cards from:"
          />
        </Text14>
        <div>
          {(competitions || []).length > 0 && (
            <Section>
              <Text14 bold color="var(--c-neutral-600)">
                <FormattedMessage
                  id="CampaignDetailsDialog.competitions"
                  defaultMessage="League"
                />
              </Text14>
              <SectionList>
                {competitions.map(competition => (
                  <Chip key={competition.slug}>
                    <CompetitionLogo small competition={competition} />
                    <Text14 bold>{competition.displayName}</Text14>
                  </Chip>
                ))}
              </SectionList>
            </Section>
          )}
        </div>
        <div>
          {(teams || []).length > 0 && (
            <Section>
              <Text14 bold color="var(--c-neutral-600)">
                <FormattedMessage
                  id="CampaignDetailsDialog.teams"
                  defaultMessage="Team"
                />
              </Text14>
              <SectionList>
                {teams.map(team => (
                  <Chip key={team.slug}>
                    <TeamAvatar team={team} size={48} />
                    <Text14 bold>{team.name}</Text14>
                  </Chip>
                ))}
              </SectionList>
            </Section>
          )}
        </div>
        <div>
          {(tiers || []).length > 0 && (
            <Section>
              <Text14 bold color="var(--c-neutral-600)">
                <FormattedMessage
                  id="CampaignDetailsDialog.tiers"
                  defaultMessage="Tiers"
                />
              </Text14>
              <SectionList>
                <Chip>
                  <Text14 bold>
                    {tiers!.map(tier => qualityNames[tier]).join(', ')}
                  </Text14>
                </Chip>
                {playerPoolUrl && (
                  <DialogLink
                    href={playerPoolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Caption color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="CampaignDetailsDialog.playerPoolLinkg"
                        defaultMessage="Player pool (informative)"
                      />
                    </Caption>
                  </DialogLink>
                )}
              </SectionList>
            </Section>
          )}
        </div>
      </DialogRoot>
    </Dialog>
  );
};

const Root = styled.div`
  color: white;
  background: rgba(var(--c-rgb-neutral-1000), 0.2);
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  background-color: transparent;
  gap: 10px;
`;
const Title = styled.div`
  flex-grow: 1;
`;

export const ReferralCampaignTitle = (props: Props) => {
  const { referralCampaign, ctaProps = {} } = props;
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const withCustomDrop =
    (referralCampaign?.teams || []).length > 0 ||
    (referralCampaign?.competitions || []).length > 0 ||
    (referralCampaign?.tiers || []).length > 0;

  if (!referralCampaign) return null;

  return (
    <>
      <Root>
        <Title>
          <CampaignTitle {...referralCampaign} />
        </Title>
        {withCustomDrop && (
          <Button
            onClick={() => setShowDetailsDialog(true)}
            color="white"
            small
            {...ctaProps}
          >
            <FormattedMessage
              id="ReferralBar.specialEventCTA"
              defaultMessage="Know more"
            />
          </Button>
        )}
      </Root>
      {showDetailsDialog && (
        <CampaignDetailsDialog
          referralCampaign={referralCampaign!}
          onClose={() => setShowDetailsDialog(false)}
        />
      )}
    </>
  );
};

ReferralCampaignTitle.fragments = {
  referralCampaign: gql`
    fragment ReferralCampaignTitle_referralCampaign on ReferralCampaign {
      id
      cardsCount
      startDate
      endDate
      playingStatuses
      playerPoolUrl
      tiers
      teams {
        ... on TeamInterface {
          slug
          name
        }
        ...TeamAvatar_team
      }
      competitions {
        slug
        displayName
        ...CompetitionLogo_competition
      }
    }
    ${TeamAvatar.fragments.team}
    ${CompetitionLogo.fragments.competition}
  `,
};

export default ReferralCampaignTitle;
