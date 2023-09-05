import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControlLabel } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Checkbox from '@core/atoms/inputs/Checkbox';
import { NativeSelect } from '@core/atoms/inputs/NativeSelect';
import { Caption, Text14, Text16, Title3, Title6 } from '@core/atoms/typography';
import IntlDate from '@core/components/IntlDate';
import { GraphqlForm, TextField } from '@core/components/form/Form';
import { useIntlContext } from '@core/contexts/intl';
import { useIntlCountries } from '@core/hooks/useIntlCountries';
import { glossary } from '@core/lib/glossary';

import StepWrapper from '../StepWrapper';
import { MANGOPAY_PRIVACY_POLICY } from '../externalLinks';
import { CreateFiatWalletSteps } from '../type';
import { useIsNotMajor } from '../useIsNotMajor';
import useGetSupportedCountries from './useGetSupportedCountries';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  height: 100%;
`;

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
  height: 100%;
`;

const StyledTextField = styled(TextField)`
  border-radius: var(--quadruple-unit);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const StyledFormControlLabel = styled(FormControlLabel)`
  gap: var(--unit);
  align-items: flex-start;
  margin: 0;
`;

const Warning = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: baseline;
  background-color: var(--c-neutral-400);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  border: 1px solid var(--c-neutral-500);
`;

const Asterisk = styled.span`
  color: var(--c-red-600);
`;

const StyledLink = styled.a`
  text-decoration: underline;
  color: var(--c-neutral-1000);
`;

const StyledCaption = styled(Caption)`
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-300);
`;

const messages = defineMessages({
  countryOfResidencePlaceholder: {
    id: 'createFiatWallet.tellUsAboutYou.countryOfResidence.placeholder',
    defaultMessage: 'Select a country of residence',
  },
  nationalityPlaceholder: {
    id: 'createFiatWallet.tellUsAboutYou.nationality.placeholder',
    defaultMessage: 'Select a nationality',
  },
});

export type TellUsAboutYouValue = {
  firstName: string;
  lastName: string;
  countryOfResidenceCode: string;
  nationalityCode: string;
  dob: Date;
};

type Props = {
  onSuccess: (args: TellUsAboutYouValue) => void;
  onSubmitWithChoosenCountryNotSupported: () => void;
  presetValues?: TellUsAboutYouValue;
  unsupportedCountryCta?: ReactNode;
  setStep: (step: CreateFiatWalletSteps) => void;
};

export const TellUsAboutYou = ({
  setStep,
  onSuccess,
  onSubmitWithChoosenCountryNotSupported,
  presetValues,
  unsupportedCountryCta = <FormattedMessage {...glossary.gotIt} />,
}: Props) => {
  const countriesOfResidence = useIntlCountries();
  const nationalities = useIntlCountries();

  const {
    firstName: firstNamePreset = '',
    lastName: lastNamePreset = '',
    countryOfResidenceCode: countryOfResidenceCodePreset,
    nationalityCode: nationalityCodePreset,
    dob: dobPreset,
  } = presetValues || {};
  const { formatMessage } = useIntlContext();
  const { supportedCountries } = useGetSupportedCountries();
  const [firstName, setFirstName] = useState<string>(firstNamePreset || '');
  const [lastName, setLastName] = useState<string>(lastNamePreset || '');
  const [dob, setDob] = useState<Date | undefined>(dobPreset);
  const [countryOfResidence, setCountryOfResidence] = useState<
    { value: string; label: string } | undefined
  >(countriesOfResidence.find(n => n.value === countryOfResidenceCodePreset));
  const [nationality, setNationality] = useState<
    { value: string; label: string } | undefined
  >(nationalities.find(n => n.value === nationalityCodePreset));
  const [sameNationalityAsCoR, setSameNationalityAsCoR] = useState(true);

  const isNotMajor = useIsNotMajor(dob);

  const updateNationalityFromCountryOfResidence = (countryCode?: string) => {
    setNationality(
      nationalities.find(
        n => n.value === (countryCode || countryOfResidence?.value)
      )
    );
  };

  const choosenCountryIsSupported =
    !countryOfResidence ||
    (countryOfResidence &&
      supportedCountries.some(
        country => country.code === countryOfResidence.value
      ));

  const disabled =
    !countryOfResidence ||
    !nationality ||
    !dob ||
    isNotMajor ||
    lastName.trim() === '' ||
    firstName.trim() === '';
  return (
    <StyledGraphqlForm
      onSuccess={() => {
        if (choosenCountryIsSupported && !disabled) {
          onSuccess({
            firstName,
            lastName,
            countryOfResidenceCode: countryOfResidence.value!,
            nationalityCode: nationality.value!,
            dob,
          });
          return;
        }
        onSubmitWithChoosenCountryNotSupported();
      }}
      onSubmit={(values, onResult) => {
        onResult({});
      }}
      render={(Error, SubmitButton) => (
        <StepWrapper
          setStep={setStep}
          step={CreateFiatWalletSteps.TELL_US_ABOUT_YOU}
          submitButton={
            <SubmitButton
              disabled={choosenCountryIsSupported && !!disabled}
              color="blue"
              medium
            >
              {choosenCountryIsSupported ? (
                <FormattedMessage {...glossary.next} />
              ) : (
                unsupportedCountryCta
              )}
            </SubmitButton>
          }
        >
          <Content>
            <Title3>
              <FormattedMessage
                id="createFiatWallet.tellUsAbotYou.title"
                defaultMessage="Tell us about yourself"
              />
            </Title3>
            <Text16>
              <FormattedMessage
                id="createFiatWallet.description"
                defaultMessage="This information helps us protect you from fraudulent activities and ensure the security of your transactions."
              />
            </Text16>
            <StyledFormControlLabel
              control={
                <NativeSelect
                  values={countriesOfResidence}
                  value={countryOfResidence?.value || ''}
                  name="countryOfResidence"
                  fullWidth
                  placeholder={formatMessage(
                    messages.countryOfResidencePlaceholder
                  )}
                  onChange={(value: string) => {
                    setCountryOfResidence(
                      countriesOfResidence?.find(n => n.value === value)
                    );
                    if (sameNationalityAsCoR) {
                      updateNationalityFromCountryOfResidence(value);
                    }
                  }}
                />
              }
              label={
                <Text16 bold color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="createFiatWallet.tellUsAboutYou.countryOfResidence.title"
                    defaultMessage="Country of residence"
                  />{' '}
                  <Asterisk>*</Asterisk>
                </Text16>
              }
              labelPlacement="top"
            />
            {choosenCountryIsSupported ? (
              <>
                <StyledFormControlLabel
                  control={
                    <>
                      <NativeSelect
                        fullWidth
                        placeholder={formatMessage(
                          messages.nationalityPlaceholder
                        )}
                        name="nationality"
                        values={nationalities}
                        value={nationality?.value ?? ''}
                        onChange={value => {
                          setNationality(
                            nationalities.find(n => n.value === value)
                          );
                          if (
                            countryOfResidence &&
                            value !== countryOfResidence.value
                          ) {
                            setSameNationalityAsCoR(false);
                          }
                        }}
                      />
                      {countryOfResidence && (
                        <Checkbox
                          checked={sameNationalityAsCoR}
                          onChange={e => {
                            setSameNationalityAsCoR(e.target.checked);
                            if (e.target.checked) {
                              updateNationalityFromCountryOfResidence();
                            }
                          }}
                          label={
                            <Text16 color="var(--c-neutral-1000)">
                              <FormattedMessage
                                id="createFiatWallet.tellUsAboutYou.sameNationalityAsCoR"
                                defaultMessage="Same as country of residence"
                              />
                            </Text16>
                          }
                        />
                      )}
                    </>
                  }
                  label={
                    <Text16 bold color="var(--c-neutral-1000)">
                      <FormattedMessage
                        id="createFiatWallet..tellUsAboutYou.nationality.title"
                        defaultMessage="Nationality"
                      />{' '}
                      <Asterisk>*</Asterisk>
                    </Text16>
                  }
                  labelPlacement="top"
                />
                <Field>
                  <Text16 bold color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="createFiatWallet.tellUsAboutYou.names.title"
                      defaultMessage="First name and last name"
                    />{' '}
                    <Asterisk>*</Asterisk>
                  </Text16>
                  <StyledTextField
                    name="firstName"
                    autoComplete="given-name"
                    placeholder={formatMessage(glossary.firstName)}
                    defaultValue={firstNamePreset}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    withoutAsterisk
                  />
                  <StyledTextField
                    name="lastName"
                    autoComplete="family-name"
                    placeholder={formatMessage(glossary.lastName)}
                    defaultValue={lastNamePreset}
                    onChange={e => setLastName(e.target.value)}
                    required
                    withoutAsterisk
                  />
                  <Text14 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="createFiatWallet.tellUsAboutYou.names.helper"
                      defaultMessage="Make sure it matches the name on your government ID."
                    />
                  </Text14>
                </Field>
                <Field>
                  <Text16 bold color="var(--c-neutral-1000)">
                    <FormattedMessage {...glossary.dateOfBirth} />{' '}
                    <Asterisk>*</Asterisk>
                  </Text16>
                  {isNotMajor && (
                    <Text14 color="var(--c-red-600)">
                      <FormattedMessage {...glossary.notMajorError} />
                    </Text14>
                  )}
                  <IntlDate
                    autoComplete="bday"
                    value={dob}
                    onChange={date => setDob(date)}
                  />
                </Field>
                <StyledCaption color="var(--c-neutral-600)">
                  <FormattedMessage
                    id="createFiatWallet.tellUsAboutYou.caption"
                    defaultMessage="Your information remains private and will be handled according to Mangopay’s <link>Privacy Policy</link>."
                    values={{
                      link: (children: string) => (
                        <StyledLink
                          href={MANGOPAY_PRIVACY_POLICY}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </StyledLink>
                      ),
                    }}
                  />
                </StyledCaption>
              </>
            ) : (
              <Warning>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  color="var(--c-neutral-1000)"
                />
                <Field>
                  <Title6>
                    <FormattedMessage
                      id="createFiatWallet.tellUsAboutYou.countryOfResidence.unsupported.title"
                      defaultMessage="Cash Wallet is not available in your country."
                    />
                  </Title6>
                  <Text14>
                    <FormattedMessage
                      id="createFiatWallet.tellUsAboutYou.countryOfResidence.unsupported"
                      defaultMessage="You can continue to list and buy cards using your Vicc ETH Wallet. We will inform you if Cash Wallet becomes available in your country."
                    />
                  </Text14>
                </Field>
              </Warning>
            )}
          </Content>
        </StepWrapper>
      )}
    />
  );
};

export default TellUsAboutYou;
