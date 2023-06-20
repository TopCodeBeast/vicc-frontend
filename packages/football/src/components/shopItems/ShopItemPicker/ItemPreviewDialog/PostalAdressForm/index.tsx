import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from '@sorare/core/src/components/form/Form';
import Select from '@sorare/core/src/components/form/Form/Select';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import CoinAmount from '@sorare/football/src/components/user/CoinAmount';

import {
  DeliverableCountriesQuery,
  PostalAdressForm_shopItem,
} from './__generated__/index.graphql';
import useBuyDeliverableShopItem from './useBuyDeliverableShopItem';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
`;
const FlexColContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const ItemImage = styled.img`
  width: 32px;
  height: 32px;
`;
const ItemDetails = styled.div`
  width: 100%;
  padding: var(--unit);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--intermediate-unit);
`;
const LoadingWrapper = styled.div`
  padding: var(--double-unit);
`;
const FormWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: var(--unit);
  grid-template-areas:
    'first_name first_name last_name last_name'
    'company company company company'
    'country country country country'
    'address address address address'
    'additional_address additional_address additional_address additional_address'
    'zip city city city'
    'cta cta cta cta';
  grid-template-columns: repeat(4, 1fr);
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

const DELIVERABLE_COUNTRIES_QUERY = gql`
  query DeliverableCountriesQuery {
    config {
      deliverableCountries {
        slug
        code
      }
    }
  }
`;

type Props = {
  item: PostalAdressForm_shopItem;
  selectedSize: ShirtSize;
  nextStep: () => void;
};
const PostalAdressForm = ({ item, selectedSize, nextStep }: Props) => {
  const { formatMessage } = useIntl();
  const [validFormValues, setValidFormValues] = useState(false);
  const buyDeliverableShopItem = useBuyDeliverableShopItem();
  const realPrice = item.salePrice ?? item.price;

  const { data, loading } = useQuery<DeliverableCountriesQuery>(
    DELIVERABLE_COUNTRIES_QUERY
  );
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
  const initialValue = countriesOptions[0];

  const onBuy = async (
    attributes: {
      first_name: string;
      last_name: string;
      company: string;
      address: string;
      additional_address: string;
      city: string;
      zipcode: string;
      country_code: string;
    },
    onResult: (result: GraphQLResult) => void
  ) => {
    buyDeliverableShopItem({
      shopItemId: item.id,
      shirtSize: selectedSize,
      postalAddress: {
        fullName: `${attributes.first_name} ${attributes.last_name}`,
        company: attributes.company,
        streetAddress: attributes.address,
        additionalAddress: attributes.additional_address,
        zipcode: attributes.zipcode,
        city: attributes.city,
        countryCode: attributes.country_code,
      },
    }).then(onResult);
  };

  return (
    <GraphqlForm
      onSubmit={(attributes, onResult) => {
        onBuy(attributes, onResult);
      }}
      onChange={({
        country_code,
        first_name,
        last_name,
        address,
        zipcode,
        city,
      }) =>
        setValidFormValues(
          country_code && first_name && last_name && address && zipcode && city
        )
      }
      onSuccess={() => nextStep()}
      render={(
        Error: React.ComponentType,
        SubmitButton: React.ComponentType<SubmitButtonProps>
      ) => (
        <Root>
          <FlexColContainer>
            <ItemDetails>
              <FlexContainer>
                <ItemImage src={item.pictureUrl} alt={item.name} />
                {item.name} - {selectedSize}
              </FlexContainer>
              <CoinAmount amount={realPrice} />
            </ItemDetails>
            <FormWrapper>
              <Country>
                {countriesOptions.length ? (
                  <Select
                    id="country_code"
                    name="country_code"
                    initialValue={initialValue}
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
                  name="first_name"
                  label={formatMessage(messages.firstName)}
                  required
                />
              </FirstName>
              <LastName>
                <TextField
                  name="last_name"
                  label={formatMessage(messages.lastName)}
                  required
                />
              </LastName>
              <Company>
                <TextField
                  name="company"
                  label={formatMessage(messages.company)}
                />
              </Company>
              <Address>
                <TextField
                  name="address"
                  label={formatMessage(messages.address)}
                  required
                />
              </Address>
              <AdditionalAddress>
                <TextField
                  name="additional_address"
                  label={formatMessage(messages.additionalAddress)}
                />
              </AdditionalAddress>
              <ZipCode>
                <TextField
                  name="zipcode"
                  label={formatMessage(messages.zipCode)}
                  required
                />
              </ZipCode>
              <City>
                <TextField
                  name="city"
                  label={formatMessage(messages.city)}
                  required
                />
              </City>
            </FormWrapper>
          </FlexColContainer>

          <SubmitButton
            disabled={loading || !validFormValues}
            color="blue"
            medium
          >
            <FormattedMessage
              id="ItemPreviewDialog.PostalAddressForm.Cta.confirm"
              defaultMessage="Confirm your purchase"
            />
          </SubmitButton>
        </Root>
      )}
    />
  );
};

PostalAdressForm.fragments = {
  shopItem: gql`
    fragment PostalAdressForm_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        price
        salePrice
        pictureUrl
      }
    }
  `,
};

export default PostalAdressForm;
