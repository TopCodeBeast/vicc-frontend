import { gql } from '@apollo/client';
import { faChevronDown, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Big from 'bignumber.js';
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import { Currency, Sport } from '@sorare/core/src/__generated__/globalTypes';
import Select from '@sorare/core/src/atoms/inputs/Select';
import Dialog, { Actions } from '@sorare/core/src/atoms/layout/Dialog';
import { Tooltip } from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14, Text16, Title6 } from '@sorare/core/src/atoms/typography';
import CreateFiatWallet from '@sorare/core/src/components/fiatWallet/CreateFiatWallet';
import {
  Field,
  GraphqlForm,
  SubmitButtonProps,
} from '@sorare/core/src/components/form/Form';
import BidInputField from '@sorare/core/src/components/form/Form/BidInputField';
import useInputOnChangeCallback from '@sorare/core/src/components/form/Form/InputField/useInputOnChangeCallback';
import {
  FEES_HELP_LINKS,
  HREF_HELP,
} from '@sorare/core/src/constants/externalLinks';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useLifecycle, {
  LIFECYCLE,
  Lifecycle,
} from '@sorare/core/src/hooks/useLifecycle';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { tradeLabels } from '@sorare/core/src/lib/glossary';
import {
  RoundingMode,
  fromWei,
  roundCeilFloat,
  toWei,
} from '@sorare/core/src/lib/wei';
import { theme } from '@sorare/core/src/style/theme';

import ConfirmationDialogContent from 'components/ConfirmationDialogContent';
import AmountWithConversion from 'components/buyActions/PaymentBox/AmountWithConversion';
import TokenSummary from 'components/buyActions/TokenSummary';
import Row from 'components/offer/Row';
import { TokenTransferValidator } from 'components/token/TokenTransferValidator';
import { TokenTransferChildrenProps } from 'components/token/TokenTransferValidator/types';
import { useMarketplaceEvents } from 'lib/events';

import { PreLaunchFiatWalletListing } from '../PreLaunchFiatWalletListing';
import { OfferDialog_token } from './__generated__/index.graphql';

interface Props {
  open: boolean;
  onClose: () => void;
  submit: ({
    weiAmount,
    duration,
  }: {
    weiAmount: string;
    duration?: number;
  }) => Promise<void>;
  title: MessageDescriptor;
  onSuccess?: () => void;
  description: ReactNode;
  showSaleDuration?: boolean;
  cta: MessageDescriptor;
  initialWeiAmount?: string;
  token: OfferDialog_token;
  confirmationMessage: MessageDescriptor;
  minimumPrice?: string;
}

export const messages = defineMessages({
  marketFees: {
    id: 'OfferDialog.marketFees',
    defaultMessage: 'Market fee',
  },
  marketFeesLabel: {
    id: 'OfferDialog.marketFeesLabel',
    defaultMessage: 'Market fee (incl. tax, if applicable)',
  },
  marketFeesDetails: {
    id: 'OfferDialog.marketFeesDetails',
    defaultMessage: 'Sorare is currently covering this fee',
  },
  tooltip: {
    id: 'OfferDialog.tooltip',
    defaultMessage: 'Market fee',
  },
  feesTooltip: {
    id: 'OfferDialog.feesTooltip',
    defaultMessage:
      'Listing is free. Once sold, the following {value}% fees are deducted.',
  },
  feesTooltipLearnMore: {
    id: 'OfferDialog.feesTooltipLearnMore',
    defaultMessage: 'Learn more',
  },
  errorMessage: {
    id: 'OfferDialog.amountInsufficient',
    defaultMessage: 'Amount too low',
  },
  warningMessage: {
    id: 'OfferDialog.amountTooLow',
    defaultMessage:
      'This amount is much lower than the recorded past transactions for this player.',
  },
  listingDuration: {
    id: 'OfferDialog.listingDuration',
    defaultMessage: 'Listing duration',
  },
  nbDays: {
    id: 'OfferDialog.DurationInput.nbDays',
    defaultMessage: '{nbDays, plural, one {# day} other {# days}}',
  },
});

const MarketFeesLabel = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;
const StyledTooltip = styled.div`
  max-width: 220px;
`;

const FeesLabel = ({
  secondaryMarketFeesRate,
  sport,
}: {
  secondaryMarketFeesRate: number;
  sport: Sport;
}) => {
  const helpLink = useMemo(() => {
    if (!sport) return HREF_HELP;
    return FEES_HELP_LINKS[sport];
  }, [sport]);

  if (secondaryMarketFeesRate > 0) {
    return (
      <MarketFeesLabel>
        <FormattedMessage {...messages.marketFeesLabel} />
        <Tooltip
          placement="top"
          enterTouchDelay={0}
          arrow
          interactive
          dark={false}
          title={
            <StyledTooltip>
              <FormattedMessage
                {...messages.feesTooltip}
                values={{ value: secondaryMarketFeesRate * 100 }}
              />{' '}
              <a href={helpLink} target="_blank" rel="noopener noreferrer">
                <FormattedMessage {...messages.feesTooltipLearnMore} />
              </a>
            </StyledTooltip>
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </Tooltip>
      </MarketFeesLabel>
    );
  }
  return (
    <div>
      <div>
        <FormattedMessage {...messages.marketFees} />
      </div>
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage {...messages.marketFeesDetails} />
      </Text14>
    </div>
  );
};

const allowedDurationsInDays = [1, 2, 3, 4, 5, 6, 7] as const;

type DurationInDays = (typeof allowedDurationsInDays)[number];

const defaultDurationInDays: DurationInDays = 2;

type DurationOptionType = { label: string; value: DurationInDays };

const StyledError = styled.div`
  color: var(--c-red-600);
  margin: var(--unit) 0;
`;
const StyledActions = styled(Actions)`
  & > * {
    flex-grow: 1;
  }
`;

const Title = styled(Text16).attrs({ bold: true })`
  text-align: center;
  color: var(--c-neutral-600);
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${theme.radius.md}px;
  background: var(--c-neutral-300);
  margin: var(--double-unit) 0;
  padding: var(--double-unit);
  gap: var(--double-unit);
`;

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
`;

const OfferDialog = ({
  onClose,
  open,
  submit,
  title,
  onSuccess,
  description,
  cta,
  initialWeiAmount,
  token,
  confirmationMessage,
  minimumPrice,
}: Props) => {
  const {
    flags: { useEnableFiatWalletBeforeLaunch = false },
  } = useFeatureFlags();

  const { hasActiveFiatBalance } = useFiatBalance();
  const [promptCreateFiatWallet, setPromptCreateFiatWallet] = useState(false);
  const [needCreateFiatWallet, setNeedCreateFiatWallet] = useState(false);

  const [promptConfirm, setPromptConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { up: isTablet } = useScreenSize('tablet');
  const { convertFromWei } = useCurrencyConverters();
  const { formatMessage } = useIntlContext();
  const { update: updateDuration } = useLifecycle();

  const {
    currentUser,
    fiatCurrency: { code: currencyCode },
  } = useCurrentUserContext();
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const lastSaleDuration = lifecycle?.lastSaleDuration;

  const track = useMarketplaceEvents();
  const [weiAmount, setWeiAmount] = useState<string>(initialWeiAmount || '0');
  const [fiatAmount, setFiatAmount] = useState(() =>
    roundCeilFloat(convertFromWei(weiAmount, currencyCode), 2)
  );
  const [durationInDays, setDurationInDays] = useState<number>(
    lastSaleDuration || defaultDurationInDays
  );

  const { sport, secondaryMarketFeeEnabled } = token;
  const { getMarketFeesRateBySport, minimumReceiveWeiAmount } =
    useConfigContext();
  const secondaryMarketFeesRate = secondaryMarketFeeEnabled
    ? getMarketFeesRateBySport(sport)
    : 0;

  const { fiatCurrency, currency } = useCurrentUserContext();

  const onChange = useInputOnChangeCallback((newEthAmount, newFiatAmount) => {
    setWeiAmount(toWei(newEthAmount));
    setFiatAmount(roundCeilFloat(newFiatAmount, 2));
  }, currencyCode);

  const onDurationChange = useCallback(
    (newDuration?: DurationOptionType | null) => {
      if (!newDuration) return;
      setDurationInDays(newDuration.value);
      updateDuration(LIFECYCLE.lastSaleDuration, newDuration.value);
    },
    [setDurationInDays, updateDuration]
  );

  const durationOptions = useMemo(
    () =>
      allowedDurationsInDays.map(element => ({
        label: formatMessage(messages.nbDays, { nbDays: element }),
        value: element,
      })),
    [formatMessage]
  );
  const selectedDuration = durationOptions.find(
    ({ value }) => value === durationInDays
  );

  const bigWeiAmount = useMemo(() => new Big(weiAmount), [weiAmount]);

  const ethAmount = useMemo(
    () => fromWei(weiAmount, 4, RoundingMode.ROUND_DOWN),
    [weiAmount]
  );

  const weiFeesAmount = useMemo(
    () => bigWeiAmount.multipliedBy(secondaryMarketFeesRate),
    [bigWeiAmount, secondaryMarketFeesRate]
  );

  const youReceiveWeiAmount = useMemo(
    () => bigWeiAmount.minus(weiFeesAmount),
    [bigWeiAmount, weiFeesAmount]
  );

  const showWarningMessage =
    new Big(minimumPrice || 0).comparedTo(weiAmount) > 0;

  const askForConfirmation = () => {
    if (useEnableFiatWalletBeforeLaunch && needCreateFiatWallet) {
      setPromptCreateFiatWallet(true);
      return;
    }
    setPromptConfirm(true);
    if (showWarningMessage) {
      track('[Client] Warning Listing too low', {
        ethAmount,
      });
    }
  };

  const submitListing = async () => {
    setSubmitting(true);
    // TODO Gabriel: Add CASH_AND_ETH / ONLY_ETH args to submit
    // when createOffer can handle.
    await submit({
      weiAmount,
      duration: durationInDays * 24 * 60 * 60,
    });
    if (showWarningMessage) {
      track('[Client] Listed after too low warning', {
        ethAmount,
      });
    }
    setSubmitting(false);
  };

  const dialogContent = ({
    validationMessages,
    loading: validationLoading,
    ConsentMessage,
  }: TokenTransferChildrenProps) => {
    const validationMessagesList = Object.values(validationMessages);

    if (promptCreateFiatWallet) {
      return (
        <CreateFiatWallet
          cta={
            <FormattedMessage
              id="OfferDialog.createFiatWallet.cta"
              defaultMessage="Confirm and List Card"
            />
          }
          onSuccess={() => {
            setNeedCreateFiatWallet(false);
            setPromptCreateFiatWallet(false);
            askForConfirmation();
          }}
        />
      );
    }
    if (promptConfirm) {
      return (
        <ConfirmationDialogContent
          token={token}
          showWarningMessage={showWarningMessage}
          weiAmount={weiAmount}
          onClose={onClose}
          submitting={submitting}
          submit={() => {
            submitListing();
            track('Click Submit List Card', {
              cardSlug: token.slug,
              hasWarnings: Object.keys(validationMessages).length > 0,
            });
          }}
          warningMessage={messages.warningMessage}
          secondaryMarketFeesRate={secondaryMarketFeesRate}
          validationMessages={
            validationMessagesList.length > 0 && validationMessagesList
          }
          ConsentMessage={ConsentMessage}
        />
      );
    }

    return (
      <>
        <StyledGraphqlForm
          onSubmit={askForConfirmation}
          onSuccess={onSuccess || onClose}
          render={(
            Error: React.ComponentType,
            SubmitButton: FunctionComponent<SubmitButtonProps>
          ) => (
            <>
              <Title>
                <FormattedMessage
                  id="OfferDialog.title"
                  defaultMessage="Your price"
                />
              </Title>
              <Error />
              <Field
                name="price"
                defaultValue={ethAmount}
                render={({ handleChange }) => (
                  <BidInputField
                    ethAmount={ethAmount}
                    fiatAmount={fiatAmount}
                    defaultCurrency={currency}
                    fiatCurrency={fiatCurrency.code}
                    onChange={(inputCurrency: Currency, amount: number) => {
                      onChange(inputCurrency, amount);
                      handleChange('price')({
                        target: { value: ethAmount.toString() },
                      });
                    }}
                  />
                )}
              />

              {!!ethAmount &&
                new Big(minimumReceiveWeiAmount).gt(weiAmount) && (
                  <StyledError>
                    <FormattedMessage {...messages.errorMessage} />
                  </StyledError>
                )}
              <DetailsWrapper>
                <TokenSummary token={token} />
                {validationMessagesList.length > 0 && validationMessagesList}
              </DetailsWrapper>
              <div>
                <Row
                  title={
                    <FeesLabel
                      secondaryMarketFeesRate={secondaryMarketFeesRate}
                      sport={sport}
                    />
                  }
                >
                  <AmountWithConversion
                    amount={weiFeesAmount.toString()}
                    context="list_modal"
                    unit="wei"
                  />
                </Row>
                <Row
                  title={
                    <Title6>{formatMessage(tradeLabels.youReceive)}</Title6>
                  }
                >
                  <AmountWithConversion
                    amount={youReceiveWeiAmount.toString()}
                    context="list_modal"
                    unit="wei"
                  />
                </Row>
                <Row
                  title={
                    <Title6 bold as="strong">
                      {formatMessage(messages.listingDuration)}
                    </Title6>
                  }
                >
                  <Select
                    options={durationOptions}
                    value={selectedDuration}
                    onChange={onDurationChange}
                    menuPlacement="top"
                    menuPosition="fixed"
                    menuLateralAlignment="right"
                    icon={faChevronDown}
                  />
                </Row>
              </div>
              {useEnableFiatWalletBeforeLaunch && !hasActiveFiatBalance && (
                <PreLaunchFiatWalletListing
                  setNeedCreateFiatWallet={setNeedCreateFiatWallet}
                />
              )}
              <StyledActions>
                <SubmitButton
                  color="blue"
                  disabled={
                    validationLoading ||
                    new Big(minimumReceiveWeiAmount).gt(weiAmount)
                  }
                >
                  <FormattedMessage {...cta} />
                </SubmitButton>
              </StyledActions>
            </>
          )}
        />
        <Description>{description}</Description>
      </>
    );
  };

  const onBack = () => {
    if (promptCreateFiatWallet) setPromptCreateFiatWallet(false);
    if (promptConfirm) setPromptConfirm(false);
  };

  return (
    <Dialog
      onBack={onBack}
      open={open}
      onClose={promptConfirm || promptCreateFiatWallet ? undefined : onClose}
      fullScreen={!isTablet}
      headerCentered
      title={
        promptConfirm ? (
          <Title6>
            <FormattedMessage {...confirmationMessage} />
          </Title6>
        ) : (
          <Title6>
            <FormattedMessage {...title} />
          </Title6>
        )
      }
    >
      <TokenTransferValidator tokens={[token]} transferContext="list">
        {dialogContent}
      </TokenTransferValidator>
    </Dialog>
  );
};

OfferDialog.fragments = {
  token: gql`
    fragment OfferDialog_token on Token {
      assetId
      slug
      sport
      secondaryMarketFeeEnabled
      ...TokenSummary_token
      ...TokenTransferValidator_token
      ...ConfirmationDialogContent_token
    }
    ${TokenSummary.fragments.token}
    ${TokenTransferValidator.fragments.token}
    ${ConfirmationDialogContent.fragments.token}
  `,
};

export default OfferDialog;
