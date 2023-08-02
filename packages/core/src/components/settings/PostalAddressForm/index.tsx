import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { PostalAddressInput } from '__generated__/globalTypes';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from '@core/components/form/Form';
import Select from '@core/components/form/Form/Select';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useQuery from '@core/hooks/graphql/useQuery';
import { toDisplayName } from '@core/lib/territories';

import {
  DeliverableCountriesQuery,
  DeliverableCountriesQueryVariables,
  PostalAddressForm_userSettings,
} from './__generated__/index.graphql';

const DELIVERABLE_COUNTRIES_QUERY = gql`
  query DeliverableCountriesQuery {
    config {
      deliverableCountries {
        slug
        code
      }
    }
  }
` as TypedDocumentNode<
  DeliverableCountriesQuery,
  DeliverableCountriesQueryVariables
>;
const LoadingWrapper = styled.div`
  padding: var(--double-unit);
`;
const FormWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: var(--unit);
  grid-template-areas:
    'first_name last_name'
    'company company'
    'country country'
    'address address'
    'additional_address additional_address'
    'zip city'
    'cta cta';
  grid-template-columns: repeat(2, 1fr);
`;
const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Country = styled.div`
  grid-area: country;
`;
const FirstName = styled.div`
  grid-area: first_name;
`;
const LastName = styled.div`
  grid-area: last_name;
`;
const Company = styled.div`
  grid-area: company;
`;
const Address = styled.div`
  grid-area: address;
`;
const AdditionalAddress = styled.div`
  grid-area: additional_address;
`;
const ZipCode = styled.div`
  grid-area: zip;
`;
const City = styled.div`
  grid-area: city;
`;

const messages = defineMessages({
  firstName: {
    id: 'ItemPreviewDialog.PostalAddressForm.firstName',
    defaultMessage: 'First name',
  },
  lastName: {
    id: 'ItemPreviewDialog.PostalAddressForm.lastName',
    defaultMessage: 'Last name',
  },
  company: {
    id: 'ItemPreviewDialog.PostalAddressForm.company',
    defaultMessage: 'Company',
  },
  address: {
    id: 'ItemPreviewDialog.PostalAddressForm.address',
    defaultMessage: 'Address',
  },
  additionalAddress: {
    id: 'ItemPreviewDialog.PostalAddressForm.additionalAddress',
    defaultMessage: 'Additional Address',
  },
  zipCode: {
    id: 'ItemPreviewDialog.PostalAddressForm.zipCode',
    defaultMessage: 'Zip Code',
  },
  city: {
    id: 'ItemPreviewDialog.PostalAddressForm.city',
    defaultMessage: 'City',
  },
  country: {
    id: 'ItemPreviewDialog.PostalAddressForm.country',
    defaultMessage: 'Country',
  },
});

type Attributes = {
  additionalAddress: string | null;
  city: string | null;
  company: string | null;
  countryCode: string | null;
  firstName: string | null;
  lastName: string | null;
  streetAddress: string | null;
  zipcode: string | null;
};
type Props = {
  onSubmit: (
    attributes: PostalAddressInput,
    onResult: (result: GraphQLResult) => void,
    onCancel: () => void
  ) => void;
  onSuccess: () => void;
  onChange?: (attributes: Attributes) => void;
  button: (
    SubmitButton: React.ComponentType<
      React.PropsWithChildren<SubmitButtonProps>
    >
  ) => ReactNode;
};
const PostalAddressForm = ({
  onSubmit,
  onSuccess,
  onChange,
  button,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();
  const { data, loading } = useQuery(DELIVERABLE_COUNTRIES_QUERY);
  const countriesOptions = [
    {
      label: formatMessage({
        id: 'ShopItemPicker.ItemPreviewDialog.PostalAddressForm.countryDefaultOption',
        defaultMessage: 'Choose a country',
      }),
      value: '',
    },
    ...(data?.config.deliverableCountries || [])
      .map(country => ({
        label: toDisplayName(country.code),
        value: country.code,
      }))
      .sort((a, b) => (a.label > b.label ? 1 : -1)),
  ];

  if (!currentUser) {
    return null;
  }

  const defaultValues = currentUser.userSettings.postalAddress;

  return (
    <GraphqlForm
      onSubmit={onSubmit}
      onChange={onChange}
      onSuccess={onSuccess}
      render={(
        Error: React.ComponentType<React.PropsWithChildren<unknown>>,
        SubmitButton: React.ComponentType<
          React.PropsWithChildren<SubmitButtonProps>
        >
      ) => (
        // key based on firstName to reset the form when the user delete his address
        <Root key={defaultValues.firstName || 'postal-address'}>
          <FormWrapper>
            <Country>
              {countriesOptions.length && !loading ? (
                <Select
                  id="countryCode"
                  name="countryCode"
                  initialValue={
                    countriesOptions.find(
                      ({ value }) => value === defaultValues?.countryCode
                    ) || countriesOptions[0]
                  }
                  label={formatMessage(messages.country)}
                  options={countriesOptions}
                  darkTheme
                />
              ) : (
                <LoadingWrapper>
                  <LoadingIndicator small />
                </LoadingWrapper>
              )}
            </Country>
            <FirstName>
              <TextField
                name="firstName"
                defaultValue={defaultValues?.firstName || undefined}
                label={formatMessage(messages.firstName)}
                required
              />
            </FirstName>
            <LastName>
              <TextField
                name="lastName"
                defaultValue={defaultValues?.lastName || undefined}
                label={formatMessage(messages.lastName)}
                required
              />
            </LastName>
            <Company>
              <TextField
                name="company"
                defaultValue={defaultValues?.company || undefined}
                label={formatMessage(messages.company)}
              />
            </Company>
            <Address>
              <TextField
                name="streetAddress"
                defaultValue={defaultValues?.streetAddress || undefined}
                label={formatMessage(messages.address)}
                required
              />
            </Address>
            <AdditionalAddress>
              <TextField
                name="additionalAddress"
                defaultValue={defaultValues?.additionalAddress || undefined}
                label={formatMessage(messages.additionalAddress)}
              />
            </AdditionalAddress>
            <ZipCode>
              <TextField
                name="zipcode"
                defaultValue={defaultValues?.zipcode || undefined}
                label={formatMessage(messages.zipCode)}
                required
              />
            </ZipCode>
            <City>
              <TextField
                name="city"
                defaultValue={defaultValues?.city || undefined}
                label={formatMessage(messages.city)}
                required
              />
            </City>
          </FormWrapper>
          {button(SubmitButton)}
        </Root>
      )}
    />
  );
};

PostalAddressForm.fragments = {
  userSettings: gql`
    fragment PostalAddressForm_userSettings on UserSettings {
      id
      postalAddress {
        firstName
        lastName
        company
        streetAddress
        additionalAddress
        zipcode
        city
        countryCode
      }
    }
  ` as TypedDocumentNode<PostalAddressForm_userSettings>,
};

export default PostalAddressForm;
