import { RadioGroup } from '@material-ui/core';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  PrivateKeyRecoveryOption,
  PrivateKeyRecoveryOptionMethodEnum,
} from '__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Radio from '@sorare/core/src/atoms/inputs/Radio';
import { Text14, Text16, Title3 } from '@sorare/core/src/atoms/typography';
import useRecoveryOptions from '@sorare/core/src/hooks/recovery/useRecoveryOptions';
import useSendRecoverKey from '@sorare/core/src/hooks/recovery/useSendRecoverKey';
import { glossary, userAttributes } from '@sorare/core/src/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--half-unit) 0;
`;

export const ChooseRestoreMethod = () => {
  const { accountEmail, recoveryEmails, phoneNumber } = useRecoveryOptions();
  const { sendRecoveryKey, sending } = useSendRecoverKey();
  const [selectedRecoveryOption, setSelectedRecoveryOption] = useState<
    PrivateKeyRecoveryOption | undefined
  >(accountEmail);
  const recoveryOptions = [
    ...(accountEmail ? [accountEmail] : []),
    ...recoveryEmails,
    ...(phoneNumber ? [phoneNumber] : []),
  ];

  const renderMethodLabel = (option: PrivateKeyRecoveryOption) => {
    if (option.method === PrivateKeyRecoveryOptionMethodEnum.PHONE)
      return <FormattedMessage {...userAttributes.phoneNumber} />;
    if (option.destination === accountEmail?.destination)
      return (
        <FormattedMessage
          id="ChooseRestoreMethod.primaryEmail"
          defaultMessage="Primary email"
        />
      );
    return <FormattedMessage {...glossary.recoveryEmail} />;
  };
  return (
    <Wrapper>
      <Title3>
        <FormattedMessage
          id="ChooseRestoreMethod.title"
          defaultMessage="Recover your wallet"
        />
      </Title3>
      <Text16>
        <FormattedMessage
          id="ChooseRestoreMethod.desc"
          defaultMessage="We noticed you recently updated your Sorare account password, for
        security reasons we’ve locked your Sorare wallet."
        />
      </Text16>
      <Text16 bold>
        <FormattedMessage
          id="ChooseRestoreMethod.helper"
          defaultMessage="To regain access to your wallet use any of the methods below to receive
          your unique recovery key."
        />
      </Text16>
      {!!recoveryOptions?.length && (
        <>
          <Text16>
            <FormattedMessage
              id="ChooseRestoreMethod.chooseDestination"
              defaultMessage="Send key to:"
            />
          </Text16>

          <RadioGroup aria-label="recovery-options">
            {recoveryOptions.map(option => (
              <Radio
                key={option.destination}
                name="recovery-method"
                value={option.destination}
                labelContent={
                  <RadioWrapper>
                    <Text16>{option.destination}</Text16>
                    <Text14 color="var(--c-neutral-600)">
                      {renderMethodLabel(option)}
                    </Text14>
                  </RadioWrapper>
                }
                checked={
                  option.destination === selectedRecoveryOption?.destination
                }
                checkedColor="var(--c-brand-600)"
                onChange={() => setSelectedRecoveryOption(option)}
                reverse
              />
            ))}
          </RadioGroup>
        </>
      )}
      <LoadingButton
        medium
        color="blue"
        onClick={() => {
          if (selectedRecoveryOption) sendRecoveryKey(selectedRecoveryOption);
        }}
        loading={sending}
      >
        <FormattedMessage {...glossary.send} />
      </LoadingButton>
    </Wrapper>
  );
};

export default ChooseRestoreMethod;
