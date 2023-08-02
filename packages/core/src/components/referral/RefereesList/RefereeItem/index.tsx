import { gql } from '@apollo/client';
import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text14, Text16 } from '@core/atoms/typography';
import OpenItemDialogLink from '@core/components/link/OpenItemDialogLink';
import { ClaimReferralRewardDialog } from '@core/components/referral/ClaimReferralRewardDialog';
import UninteractiveToken from '@core/components/token/UninteractiveToken';
import { GalleryLink } from '@core/components/user/GalleryLink';
import { Nickname } from '@core/components/user/Nickname';
import { useIntlContext } from '@core/contexts/intl';
import { useReferralReward } from '@core/hooks/useReferralReward';
import useToggle from '@core/hooks/useToggle';
import { glossary } from '@core/lib/glossary';

import { ReferralStatus } from './ReferralStatus';
import { RefereeItem_referral } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--double-unit);
  padding: var(--unit) var(--double-unit);
`;
const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
  overflow: hidden;
`;
const CardWithInfos = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
`;
const Card = styled.div`
  width: 40px;
`;
const Infos = styled.div`
  overflow: hidden;
`;
const StyledText16 = styled(Text16)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const StyledText14 = styled(Text14)`
  display: inline-flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  refereeItem: RefereeItem_referral;
  cardsRequirements: number | null | undefined;
};

const RefereeItemContent = ({ refereeItem, cardsRequirements }: Props) => {
  const { referrerReward } = refereeItem;
  const { claimed } = useReferralReward(referrerReward);
  const { formatDistanceToNowStrict } = useIntlContext();
  const [openClaimDialog, toggleOpenClaimDialog] = useToggle(false);

  const renderTime = (referral: RefereeItem_referral) => {
    if (referral.aasmState === 'expired') {
      return (
        <StyledText14 color="var(--c-red-800)">
          <FontAwesomeIcon icon={faClock} width={12} />
          <FormattedMessage
            id="RefereesList.expired"
            defaultMessage="Expired"
          />
        </StyledText14>
      );
    }
    if (referral.aasmState === 'rewarded' && referral.completedAt) {
      return (
        <StyledText14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="MyReferees.timeAgo"
            defaultMessage="{time} ago"
            values={{
              time: formatDistanceToNowStrict(parseISO(referral.completedAt), {
                addSuffix: false,
              }),
            }}
          />
        </StyledText14>
      );
    }

    return (
      <StyledText14 color="var(--c-yellow-800)">
        <FontAwesomeIcon icon={faClock} width={12} />
        <FormattedMessage
          id="MyReferees.timeLeft"
          defaultMessage="{time} left"
          values={{
            time: formatDistanceToNowStrict(parseISO(referral.expirationDate), {
              addSuffix: false,
            }),
          }}
        />
      </StyledText14>
    );
  };

  return (
    <Root>
      <Content>
        <CardWithInfos>
          {referrerReward && claimed && (
            <Card>
              <OpenItemDialogLink
                sport={referrerReward.token.sport}
                item={referrerReward.token}
              >
                <UninteractiveToken token={referrerReward.token} />
              </OpenItemDialogLink>
            </Card>
          )}
          <Infos>
            {renderTime(refereeItem)}
            {refereeItem.refereeInvitationSentAt &&
            !refereeItem.refereeConfirmedAt ? (
              <StyledText16 bold>
                {refereeItem.refereeIdentification}
              </StyledText16>
            ) : (
              <GalleryLink user={refereeItem.referee}>
                <StyledText16 bold color="var(--c-neutral-1000)">
                  <Nickname user={refereeItem.referee} />
                </StyledText16>
              </GalleryLink>
            )}
          </Infos>
        </CardWithInfos>
        {(!referrerReward || claimed) && (
          <ReferralStatus
            referral={refereeItem}
            cardsRequirements={cardsRequirements}
          />
        )}
      </Content>
      {referrerReward && !claimed && (
        <Button medium color="black" onClick={toggleOpenClaimDialog}>
          <FormattedMessage {...glossary.claim} />
        </Button>
      )}
      <ClaimReferralRewardDialog
        referralReward={referrerReward}
        open={openClaimDialog}
        onClose={toggleOpenClaimDialog}
      />
    </Root>
  );
};

export const RefereeItem = ({ refereeItem, cardsRequirements }: Props) => {
  return (
    <RefereeItemContent
      refereeItem={refereeItem}
      cardsRequirements={cardsRequirements}
    />
  );
};

// RefereeItem.fragments = {
//   referral: gql`
//     fragment RefereeItem_referral on Referral {
//       id
//       aasmState
//       completedAt
//       expirationDate
//       referee {
//         slug
//         ...GalleryLink_publicUserInfoInterface
//         ...Nickname_publicUserInfoInterface
//       }
//       refereeIdentification
//       refereeConfirmedAt
//       refereeInvitationSentAt
//       ...ReferralStatus_referral
//       referrerReward {
//         id
//         token {
//           assetId
//           slug
//           sport
//           ...UninteractiveToken_token
//         }
//         ...ClaimReferralRewardDialog_referralReward
//         #...useReferralReward_referralReward
//       }
//     }
//     ${GalleryLink.fragments.user}
//     ${ReferralStatus.fragments.referral}
//     ${Nickname.fragments.user}
//     ${ClaimReferralRewardDialog.fragments.referralReward}
//     #{useReferralReward.fragments.referralReward}
//     ${UninteractiveToken.fragments.token}
//   `,
// };
