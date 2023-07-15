import { gql } from '@apollo/client';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { MarketplacePreference, Sport } from '__generated__/globalTypes';
import Switch from '@core/atoms/inputs/Switch';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { ConfirmDialog } from '@core/components/form/ConfirmDialog';
import useQuery from '@core/hooks/graphql/useQuery';
import useUpdateUserProfile from '@core/hooks/useUpdateUserProfile';
import { sportsLabelsMessages } from '@core/lib/glossary';

import SettingsSection from '../SettingsSection';
import {
  AcceptCashOffersQuery,
  AcceptCashOffersQueryVariables,
} from './__generated__/index.graphql';

const ACCEPT_CASH_OFFERS_QUERY = gql`
  query AcceptCashOffersQuery {
    currentUser {
      slug
      profile {
        id
        marketplacePreferences(sports: [CRICKET]) {
          sport
          preferences {
            name
            value
          }
        }
      }
    }
  }
`;

const messages = defineMessages({
  title: {
    id: 'Settings.AcceptCashOnly.onlyAcceptETHOffers',
    defaultMessage: 'Only accept ETH offers',
  },
  description: {
    id: 'Settings.AcceptCashOnly.description',
    defaultMessage:
      'Prevent managers to propose cards as part of a trade to you, only ETH.',
  },
});

const Option = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AcceptCashOnly = () => {
  const [confirmingPreference, setConfirmingPreference] = useState<{
    sport: Sport;
    preference: MarketplacePreference;
    checked: boolean;
  }>();

  const updateUserProfile = useUpdateUserProfile();

  const { data, loading } = useQuery<
    AcceptCashOffersQuery,
    AcceptCashOffersQueryVariables
  >(ACCEPT_CASH_OFFERS_QUERY);

  const acceptCashOffersPreferences = useMemo(
    () =>
      (data?.currentUser?.profile.marketplacePreferences
        .map(({ sport, preferences }) => ({
          sport,
          preference: preferences.find(
            ({ name }) => name === 'cash_only_offers'
          ),
        }))
        .filter(({ preference }) => !!preference) || []) as {
        sport: Sport;
        preference: MarketplacePreference;
      }[],
    [data]
  );

  const onChange = ({
    sport,
    preference,
    checked,
  }: {
    sport: Sport;
    preference: MarketplacePreference;
    checked: boolean;
  }) => {
    updateUserProfile({
      marketplacePreferences: [
        {
          sports: [sport],
          name: preference.name,
          value: checked,
        },
      ],
    });
  };

  return (
    <SettingsSection {...messages}>
      {loading && <LoadingIndicator small />}
      {acceptCashOffersPreferences?.map(({ sport, preference }) => {
        return (
          <Option key={sport}>
            <FormattedMessage {...sportsLabelsMessages[sport]} />
            <Switch
              checked={!!preference.value}
              onChange={event =>
                // onChange(sport, preference, event.target.checked)
                setConfirmingPreference({
                  sport,
                  preference,
                  checked: event.target.checked,
                })
              }
            />
          </Option>
        );
      })}
      {confirmingPreference && (
        <ConfirmDialog
          open
          onClose={() => setConfirmingPreference(undefined)}
          message={
            <FormattedMessage
              id="Settings.AcceptCashOnly.confirmChange"
              defaultMessage="Managers will no longer be able to propose cards as part of a trade to you, only ETH. Are you sure?"
            />
          }
          onConfirm={() => onChange(confirmingPreference)}
        />
      )}
    </SettingsSection>
  );
};
