import {
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title6 } from '@sorare/core/src/atoms/typography';
import { Input } from 'components/form/Form/IntlTelInput';
import {
  SecurityCheckTab,
  useAccountSecurityCheckContext,
} from 'contexts/accountSecurityCheck';
import { useCurrentUserContext } from 'contexts/currentUser';
import { glossary } from '@sorare/core/src/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Title = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

export const PhoneNumber = () => {
  const { setSecurityCheckTab, setOnBackTarget, setUnverifiedPhoneNumber } =
    useAccountSecurityCheckContext();
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;

  const {
    phoneNumber,
    unverifiedPhoneNumber,
    phoneNumberVerificationRequested,
  } = currentUser;

  const addOrVerify = () => {
    if (phoneNumberVerificationRequested) {
      setSecurityCheckTab(SecurityCheckTab.VERIFY_PHONE_NUMBER);
      setOnBackTarget(SecurityCheckTab.ADD_PHONE_NUMBER);
      setUnverifiedPhoneNumber(unverifiedPhoneNumber!);
    } else {
      setSecurityCheckTab(SecurityCheckTab.ADD_PHONE_NUMBER);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>
          {phoneNumber ? (
            <FontAwesomeIcon icon={faCircleCheck} color="var(--c-green-600)" />
          ) : (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              color="var(--c-red-300)"
            />
          )}
          <Title6 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="accountSecurityCheck.phoneNumber.title"
              defaultMessage="Phone number"
            />
          </Title6>
        </Title>
        {!phoneNumber && (
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="accountSecurityCheck.phoneNumber.desc"
              defaultMessage="Sorare uses phone numbers for security and anti-fraud purposes. It also helps our support team verify your identity in case you’ve lost your authentication device and recovery code."
            />
          </Text14>
        )}
      </Header>
      {currentUser.phoneNumber && (
        <Input phone={currentUser.phoneNumber} noBorder disabled hideDetails />
      )}
      {!phoneNumber && (
        <Text16 color="var(--c-link)">
          <button type="button" onClick={addOrVerify}>
            <FormattedMessage {...glossary.addPhoneNumber} />
          </button>
        </Text16>
      )}
    </Wrapper>
  );
};

export default PhoneNumber;
