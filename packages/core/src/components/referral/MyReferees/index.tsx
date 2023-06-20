import { faCheckCircle, faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ReferralState } from '__generated__/globalTypes';
import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Title4 } from '@sorare/core/src/atoms/typography';
import FilterInDropdown from 'components/FilterInDropdown';
import RefereesList from 'components/referral/RefereesList';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useIntlContext } from 'contexts/intl';
import { sportsLabelsMessages } from '@sorare/core/src/lib/glossary';

import { messages } from './messages';

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Subtitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
`;
const Evolution = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  color: var(--c-neutral-1000);
`;
const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const Counter = styled.span`
  font: var(--t-bolder) var(--t-24);
`;

export const MyReferees = () => {
  const { formatMessage } = useIntlContext();
  const { currentUser } = useCurrentUserContext();

  const [referralState, setReferralState] = useState<ReferralState>(
    ReferralState.ALL
  );

  const selectOptions = useMemo(
    () =>
      Object.values(ReferralState).map(element => ({
        value: element,
        label: formatMessage(messages[element]),
      })),
    [formatMessage]
  );

  if (!currentUser) return null;

  const selectedOption = selectOptions.find(o => o.value === referralState);
  const showBreakdownTooltip =
    currentUser.referralRewardsCount !==
      currentUser.footballReferralsCompleted.totalCount &&
    currentUser.referralRewardsCount !==
      currentUser.nbaReferralsCompleted.totalCount &&
    currentUser.referralRewardsCount !==
      currentUser.baseballReferralsCompleted.totalCount;

  return (
    <Root>
      <Title4>
        <FormattedMessage
          id="MyReferees.title"
          defaultMessage="Invitations sent"
        />
      </Title4>
      <Subtitle>
        <Evolution>
          <Tooltip
            title={
              showBreakdownTooltip ? (
                <div>
                  <div>
                    <FormattedMessage {...sportsLabelsMessages.FOOTBALL} />:{' '}
                    {currentUser.footballReferralsCompleted.totalCount}
                  </div>
                  <div>
                    <FormattedMessage {...sportsLabelsMessages.NBA} />:{' '}
                    {currentUser.nbaReferralsCompleted.totalCount}
                  </div>
                  <div>
                    <FormattedMessage {...sportsLabelsMessages.BASEBALL} />:{' '}
                    {currentUser.baseballReferralsCompleted.totalCount}
                  </div>
                </div>
              ) : (
                ''
              )
            }
          >
            <Stat>
              <FontAwesomeIcon
                icon={faCheckCircle}
                color="var(--c-static-green-300)"
              />
              <Counter>{currentUser.referralRewardsCount}</Counter>
            </Stat>
          </Tooltip>

          <Stat>
            <FontAwesomeIcon icon={faEnvelope} color="var(--c-neutral-1000)" />
            <Counter>{currentUser.referrals.totalCount}</Counter>
          </Stat>
        </Evolution>
        {!!currentUser.referrals.totalCount && (
          <FilterInDropdown buttonLabel={selectedOption?.label}>
            {({ closeDropdown }) => (
              <RadioGroup<ReferralState>
                name="referee-state"
                options={selectOptions}
                onChange={value => {
                  setReferralState(value);
                  closeDropdown();
                }}
              />
            )}
          </FilterInDropdown>
        )}
      </Subtitle>
      <RefereesList referralState={referralState} />
    </Root>
  );
};

export default MyReferees;
