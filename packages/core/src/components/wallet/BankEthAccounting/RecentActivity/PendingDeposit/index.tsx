import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowDownLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { DepositProvider } from '__generated__/globalTypes';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Text14, Title6 } from '@core/atoms/typography';
import { AmountWithConversion } from '@core/components/buyActions/AmountWithConversion';
import { useIntlContext } from '@core/contexts/intl';
import { useWalletContext } from '@core/contexts/wallet';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { glossary } from '@core/lib/glossary';
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';

import { PendingDeposit_pendingDeposit } from './__generated__/index.graphql';

const Deposit = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: space-between;
`;

const DepositContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding: var(--unit) 0;
`;

const GreyLine = styled.div`
  color: var(--c-neutral-600);
`;
const TextRight = styled.div`
  text-align: right;
`;

const Infos = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Icon = styled(FontAwesomeIcon)`
  width: var(--double-unit);
  height: var(--double-unit);
  border-radius: 50%;
  align-self: center;
  background-color: transparent;
  border: 1px solid var(--c-neutral-600);
  color: var(--c-neutral-600);
  padding: var(--unit);
`;

type Props = {
  deposit: PendingDeposit_pendingDeposit;
};

const PendingDeposit = ({ deposit }: Props) => {
  const {
    flags: { useEthExternalDepositMonitoring = false },
  } = useFeatureFlags();
  const { amounts, date, providerType, id, transactionHash } = deposit;
  const { formatDate, formatTime } = useIntlContext();
  const { promptDeposit } = useWalletContext();
  const { setCurrentTab } = useWalletDrawerContext();

  const doPromptDeposit = () => {
    promptDeposit(id);
    setCurrentTab(WalletTab.DEPOSIT);
  };

  const externalTransactionInProgress = !!transactionHash;
  if (
    providerType === DepositProvider.EXTERNAL &&
    !useEthExternalDepositMonitoring
  )
    return null;
  return (
    <DepositContainer>
      <Deposit>
        <Infos>
          <Icon icon={faArrowDownLeft} />
          <div>
            <Title6>
              <FormattedMessage {...glossary.deposit} />
            </Title6>
            <GreyLine>
              <Text14>
                <FormattedMessage
                  id="bankEthAccounting.recentActivity.pendingDeposit.date"
                  defaultMessage="{date} at {time}"
                  values={{
                    date: formatDate(date),
                    time: formatTime(date),
                  }}
                />
              </Text14>
            </GreyLine>
          </div>
        </Infos>
        <GreyLine>
          <TextRight>
            <AmountWithConversion monetaryAmount={amounts} column />
          </TextRight>
        </GreyLine>
      </Deposit>
      {providerType === DepositProvider.EXTERNAL &&
        !externalTransactionInProgress && (
          <LoadingButton
            onClick={doPromptDeposit}
            small
            color="blue"
            loading={false}
          >
            <FormattedMessage
              id="bankEthAccounting.recentActivity.pendingDeposit.finalize"
              defaultMessage="Finalize deposit"
            />
          </LoadingButton>
        )}
    </DepositContainer>
  );
};

PendingDeposit.fragments = {
  pendingDeposit: gql`
    fragment PendingDeposit_pendingDeposit on PendingDeposit {
      id
      date
      providerType
      transactionHash
      amounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<PendingDeposit_pendingDeposit>,
};

export default PendingDeposit;
