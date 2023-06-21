import { gql } from '@apollo/client';
import classNames from 'classnames';
import { parseISO } from 'date-fns';
import { FC, Fragment } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/MarketplaceOnboardingTask';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { glossary } from '@sorare/core/src/lib/glossary';

import ItemEndDate from '@marketplace/components/ItemPreview/ItemEndDate';
import {
  ButtonContainer,
  TokenDetailsInfos,
  TokenDetailsRoot,
  TokenDetailsRow,
} from '@marketplace/components/ItemPreview/ui';
import TokenListingsCount from '@marketplace/components/TokenPreview/TokenListingsCount';
import TokenOwner from '@marketplace/components/TokenPreview/TokenOwner';
import BuyField from '@marketplace/components/buyActions/BuyField';
import useGetTokenSingleSaleDetails from '@marketplace/hooks/offers/useGetTokenSingleSaleDetails';

import { SalePrice } from '../SalePrice';
import {
  LiveSaleDetails_offer,
  LiveSaleDetails_token,
} from './__generated__/index.graphql';

const messages = defineMessages({
  button: {
    id: 'TokenOfferDetails.tooltip.buttonLabel',
    defaultMessage: 'OK, let’s go!',
  },
});

const SaleInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  min-width: 0;
  height: var(--triple-unit);

  .dark-theme & {
    color: var(--c-neutral-600);
  }
`;

const StyledCaption = styled(Caption)`
  display: flex;
  gap: var(--half-unit);
  overflow: hidden;
`;

const DivElement: FC = ({ children }) => <div>{children}</div>;

const NotificationContainer = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

type Props = {
  sale: LiveSaleDetails_offer;
  token: LiveSaleDetails_token;
  isDesktopLayout?: boolean;
  stackedTokensCount?: number;
  displayMarketplaceOnboardingTooltip?: boolean;
  allowColumnLayout?: boolean;
  showFees?: boolean;
};

export const LiveSaleDetails = ({
  sale,
  token,
  isDesktopLayout,
  stackedTokensCount,
  displayMarketplaceOnboardingTooltip,
  allowColumnLayout,
  showFees,
}: Props) => {
  const {
    flags: { useSportWithUncoloredCta = [] },
  } = useFeatureFlags();
  const { showNotification } = useSnackNotificationContext();
  const { setStep, onSuccessCallback, setTask, task } = useManagerTaskContext();
  const useUncoloredCta = useSportWithUncoloredCta.includes(token.sport);

  const isStackedOffer = stackedTokensCount && stackedTokensCount > 1;
  const Wrapper = isDesktopLayout ? DivElement : Fragment;

  return (
    <TokenDetailsRoot className={classNames({ allowColumnLayout })}>
      <TokenDetailsInfos>
        {isStackedOffer ? (
          <>
            <div>
              {isDesktopLayout && (
                <SaleInfoContainer>
                  <Caption color="var(--c-neutral-600)">
                    <FormattedMessage {...glossary.startingAt} />
                  </Caption>
                </SaleInfoContainer>
              )}
              <SalePrice sale={sale} showFees={showFees} />
            </div>
            <TokenDetailsRow>
              <Caption color="var(--c-neutral-600)">
                <TokenListingsCount count={stackedTokensCount} />
              </Caption>
            </TokenDetailsRow>
          </>
        ) : (
          <>
            <Wrapper>
              <SalePrice sale={sale} showFees={showFees} />
              <TokenDetailsRow>
                <StyledCaption color="var(--c-neutral-600)" as="div">
                  {isDesktopLayout ? (
                    <FormattedMessage
                      id="TokenDesktopPreviewContent.directSale"
                      defaultMessage="Direct sale"
                    />
                  ) : (
                    <TokenOwner token={token} withAvatar />
                  )}
                  {' • '}
                  <ItemEndDate
                    endDate={parseISO(sale.endDate)}
                    withExplicitTime={isDesktopLayout}
                  />
                </StyledCaption>
              </TokenDetailsRow>
            </Wrapper>
            {isDesktopLayout && (
              <TokenDetailsRow>
                <TokenOwner token={token} withAvatar />
              </TokenDetailsRow>
            )}
          </>
        )}
      </TokenDetailsInfos>

      <ButtonContainer>
        <ManagerTaskTooltip
          name={MarketplaceOnboardingStep.buy}
          title={
            <MarketplaceOnboardingTask
              name={MarketplaceOnboardingStep.buy}
              buttonLabel={messages.button}
              onClick={() => {
                onSuccessCallback?.();
                setTask();
                setStep();
                showNotification(
                  'exploreMarketplaceSuccess',
                  {
                    notification: (...chunks: string[]) => (
                      <NotificationContainer>
                        <ScarcityIcon size="lg" scarcity={Rarity.limited} />
                        <div>{chunks}</div>
                      </NotificationContainer>
                    ),
                    success: (...chunks: string[]) => (
                      <Text14 color="var(--c-static-green-300)">
                        {chunks}
                      </Text14>
                    ),
                  },
                  {
                    level: Level.INFO,
                    autoHideDuration: null,
                  }
                );
              }}
            />
          }
          noBackdrop
          placement={isDesktopLayout ? 'right-end' : 'bottom-start'}
          fullWidth={isDesktopLayout}
          disable={!task || !displayMarketplaceOnboardingTooltip}
        >
          <BuyField
            color={useUncoloredCta ? 'mediumGray' : 'green'}
            cancelStroke={!useUncoloredCta}
            token={token}
            small
            stroke
            buttonLabel={
              isStackedOffer ? (
                <FormattedMessage {...glossary.buyLowest} />
              ) : undefined
            }
          />
        </ManagerTaskTooltip>
      </ButtonContainer>
    </TokenDetailsRoot>
  );
};

LiveSaleDetails.fragments = {
  token: gql`
    fragment LiveSaleDetails_token on Token {
      assetId
      slug
      sport
      ...TokenOwner_token
      ...BuyField_token
      ...useGetTokenSingleSaleDetails_token
    }
    ${TokenOwner.fragments.token}
    ${BuyField.fragments.token}
    ${useGetTokenSingleSaleDetails.fragments.token}
  `,
  offer: gql`
    fragment LiveSaleDetails_offer on TokenOffer {
      id
      priceWei
      endDate
      ...SalePrice_offer
    }
    ${SalePrice.fragments.offer}
  `,
};
