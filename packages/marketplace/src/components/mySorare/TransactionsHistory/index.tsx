import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { faDownToLine } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs } from '@material-ui/core';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Tab from '@sorare/core/src/atoms/layout/Tab';
import TabContainer from '@sorare/core/src/atoms/layout/TabContainer';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import MyPage from '../MyPage';
import { MyViccPage } from '../common/pages';
import { SpentFiatPaymentIntents } from './SpentFiatPaymentIntents';
import { UserAccountEntries } from './UserAccountEntries';
import {
  GenerateAccountingExtractMutation,
  GenerateAccountingExtractMutationVariables,
} from './__generated__/index.graphql';

const GENERATE_ACCOUNTING_EXTRACT_MUTATION = gql`
  mutation GenerateAccountingExtractMutation(
    $input: generateAccountingExtractInput!
  ) {
    generateAccountingExtract(input: $input) {
      errors {
        code
        message
        path
      }
    }
  }
` as TypedDocumentNode<
  GenerateAccountingExtractMutation,
  GenerateAccountingExtractMutationVariables
>;

enum TransactionTabs {
  ETH = 'ETH',
  FIAT = 'FIAT',
  CREDIT_CARD = 'CREDIT_CARD',
}

const CurrencyType = {
  [TransactionTabs.FIAT]: Currency.FIAT,
  [TransactionTabs.ETH]: Currency.ETH,
};

const messages = defineMessages({
  [TransactionTabs.FIAT]: {
    id: 'TransactionTabs.fiat',
    defaultMessage: 'FIAT',
  },
  [TransactionTabs.ETH]: {
    id: 'PaymentBox.eth',
    defaultMessage: 'ETH',
  },
  [TransactionTabs.CREDIT_CARD]: {
    id: 'TransactionTabs.creditCard',
    defaultMessage: 'Credit card',
  },
});

export const TransactionsHistory = () => {
  const { formatMessage } = useIntlContext();

  const {
    walletPreferences: { showFiatWallet, showEthWallet },
  } = useCurrentUserContext();

  const { showNotification } = useSnackNotificationContext();
  const {
    flags: { useAccountingExtract = false },
  } = useFeatureFlags();

  const initTab = showEthWallet ? TransactionTabs.ETH : TransactionTabs.FIAT;
  const [tab, setTab] = useState<TransactionTabs>(initTab);

  const [generate, { loading }] = useMutation(
    GENERATE_ACCOUNTING_EXTRACT_MUTATION
  );

  const generateAccountExtract = () => {
    generate({ variables: { input: {} } }).then(({ data }) => {
      if (!data?.generateAccountingExtract?.errors.length) {
        showNotification('accountingExtractSent');
      }
    });
  };

  return (
    <MyPage
      page={MyViccPage.TRANSACTIONS}
      toolbar={
        useAccountingExtract && (
          <LoadingButton
            color="white"
            small
            startIcon={<FontAwesomeIcon icon={faDownToLine} />}
            onClick={generateAccountExtract}
            loading={loading}
          >
            <FormattedMessage
              id="MyVicc.TransactionsHistory.downloadCSV"
              defaultMessage="Download CSV"
            />
          </LoadingButton>
        )
      }
    >
      <>
        <Tabs
          value={tab}
          onChange={(_event, val) => setTab(val)}
          variant="fullWidth"
        >
          {showEthWallet && (
            <Tab
              label={formatMessage(messages.ETH)}
              value={TransactionTabs.ETH}
            />
          )}
          {showFiatWallet && (
            <Tab
              label={formatMessage(messages.FIAT)}
              value={TransactionTabs.FIAT}
            />
          )}

          <Tab
            label={formatMessage(messages.CREDIT_CARD)}
            value={TransactionTabs.CREDIT_CARD}
          />
        </Tabs>
        <TabContainer>
          {(tab === TransactionTabs.ETH || tab === TransactionTabs.FIAT) && (
            <UserAccountEntries currency={CurrencyType[tab]} />
          )}
          {tab === TransactionTabs.CREDIT_CARD && <SpentFiatPaymentIntents />}
        </TabContainer>
      </>
    </MyPage>
  );
};

export default TransactionsHistory;
