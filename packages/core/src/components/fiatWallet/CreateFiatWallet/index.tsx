import { FormControlLabel } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import RadioGroup from '@core/atoms/inputs/RadioGroup';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text14, Text16, Title3 } from '@core/atoms/typography';
import FilterInDropdown from '@core/components/FilterInDropdown';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import { PRIVACY_POLICY } from '@core/constants/routes';
import { useIntlContext } from '@core/contexts/intl';
import { glossary } from '@core/lib/glossary';
import { toDisplayName } from '@core/lib/territories';

import useCreateFiatWallet from './useCreateFiatWallet';
import useGetSupportedCountries from './useGetSupportedCountries';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  justify-content: flex-start;
`;

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
`;

const LinkInFormattedMessage = styled.a`
  text-decoration: underline;
`;

const OptionLabel = styled(Text16)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--unit) 0;
  gap: var(--double-unit);
`;

const Flag = styled.img`
  height: var(--double-unit);
`;

const StyledTextField = styled(TextField)`
  border-radius: var(--quadruple-unit);
`;

const Field = styled(FormControlLabel)`
  gap: var(--unit);
  align-items: flex-start;
  margin: 0;
`;

type Props = {
  onSuccess: () => void;
  cta?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
};

const needsAdditionalFieldsCountries: ReadonlyArray<string> = ['us'] as const;

export const CreateFiatWallet = ({
  onSuccess,
  title,
  description,
  cta,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const { supportedCountries, loading: countriesLoading } =
    useGetSupportedCountries();
  const { create, loading } = useCreateFiatWallet();
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<
    | {
        label: ReactNode;
        value: string;
      }
    | undefined
  >(undefined);

  const formIsIncomplete =
    !countryCode ||
    (needsAdditionalFieldsCountries.includes(countryCode.value) &&
      (!firstName || !lastName));

  const disabled = countriesLoading || loading || formIsIncomplete;

  const onSubmit = async (
    variables: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const data = await create({
      countryCode: countryCode!.value,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    });
    if (!data) return;
    onResult(data);
  };

  const options = supportedCountries?.map(({ slug, code, flagUrl }) => ({
    label: (
      <OptionLabel color="var(--c-neutral-1000)">
        <Flag alt={slug} src={flagUrl} />
        <span>{toDisplayName(code)}</span>
      </OptionLabel>
    ),
    value: code,
  }));

  return (
    <Content>
      <StyledGraphqlForm
        onSubmit={(variables, onResult) => {
          onSubmit(variables, onResult);
        }}
        onSuccess={onSuccess}
        render={(Error, SubmitButton) => (
          <Content>
            <Title3>
              {title || (
                <FormattedMessage
                  id="createFiatWallet.title"
                  defaultMessage="Confirm additional details"
                />
              )}
            </Title3>
            <Text16>
              {description || (
                <FormattedMessage
                  id="createFiatWallet.description"
                  defaultMessage="To receive cash on Sorare we need to confirm some additional details. This information remains private and is solely used according to our <link>Privacy Policy</link>."
                  values={{
                    link: (text: string) => (
                      <LinkInFormattedMessage
                        target="_blank"
                        href={PRIVACY_POLICY}
                      >
                        {text}
                      </LinkInFormattedMessage>
                    ),
                  }}
                />
              )}
            </Text16>
            <Field
              control={
                (!countriesLoading && (
                  <FilterInDropdown
                    fullWidth
                    buttonSize="medium"
                    buttonLabel={
                      countryCode?.label || (
                        <Text16 color="var(--c-neutral-600)">
                          <FormattedMessage
                            id="createFiatWallet.selectCountry"
                            defaultMessage="Select country of residence"
                          />
                        </Text16>
                      )
                    }
                  >
                    {({ closeDropdown }) => (
                      <RadioGroup
                        modal
                        options={options}
                        value={countryCode?.value || ''}
                        name="countryCode"
                        onChange={(value: string) => {
                          setCountryCode(options.find(o => o.value === value)!);
                          closeDropdown();
                        }}
                      />
                    )}
                  </FilterInDropdown>
                )) || <LoadingIndicator small />
              }
              label={
                <Text16 bold color="var(--c-neutral-1000)">
                  <FormattedMessage {...glossary.countryOfResidence} /> *
                </Text16>
              }
              labelPlacement="top"
            />

            {countryCode &&
              needsAdditionalFieldsCountries.includes(countryCode.value) && (
                <>
                  <div>
                    <Text16 bold color="var(--c-neutral-1000)">
                      <FormattedMessage
                        id="createFiatWallet.additionalFields.title"
                        defaultMessage="First name and last name"
                      />
                    </Text16>
                    <Text14 color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="createFiatWallet.additionalFields.helper"
                        defaultMessage="Make sure it matches the name in your government ID."
                      />
                    </Text14>
                  </div>
                  <StyledTextField
                    name="firstName"
                    placeholder={formatMessage(glossary.firstName)}
                    required
                    onChange={e => setFirstName(e.target.value)}
                  />
                  <StyledTextField
                    name="lastName"
                    placeholder={formatMessage(glossary.lastName)}
                    required
                    onChange={e => setLastName(e.target.value)}
                  />
                </>
              )}
            <Error />
            <SubmitButton fullWidth color="blue" medium disabled={disabled}>
              {cta || <FormattedMessage {...glossary.submit} />}
            </SubmitButton>
          </Content>
        )}
      />
    </Content>
  );
};

export default CreateFiatWallet;
