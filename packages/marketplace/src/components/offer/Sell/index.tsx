import { TypedDocumentNode, gql } from '@apollo/client';
import { faWarning } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Tradeable } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text16 } from '@sorare/core/src/atoms/typography';
import useTokenBelongsToUser from '@sorare/core/src/hooks/useTokenBelongsToUser';

import NewSaleDialog from '@marketplace/components/offer/NewSaleDialog';
import { TokenTransferValidator } from '@marketplace/components/token/TokenTransferValidator';
import useCannotSell from '@marketplace/hooks/offers/useCannotSell';
import { useMarketplaceEvents } from '@marketplace/lib/events';

import { SellCard_token } from './__generated__/index.graphql';

const messages = defineMessages<Tradeable>({
  [Tradeable.NOT_YET]: {
    id: 'Sell.not_yet',
    defaultMessage: 'Your Card is not transferable yet. It will be soon!',
  },
  [Tradeable.NO]: {
    id: 'Sell.no',
    defaultMessage:
      'Your Card cannot be sold. You must transfer it to your Vicc account.',
  },
  [Tradeable.YES]: {
    id: 'Sell.yes',
    defaultMessage: 'Your Card can be sold on the Manager Sales Market.',
  },
  [Tradeable.UNDEFINED]: {
    id: 'Sell.undefined',
    defaultMessage: 'This Card has no owner.',
  },
  [Tradeable.DEPOSIT_REQUIRED]: {
    id: 'Sell.deposit_required',
    defaultMessage: 'You need to make a deposit.',
  },
});

interface SellProps {
  token: SellCard_token;
}

const Root = styled.div`
  display: flex;
`;
const ListButton = styled(Button)`
  flex-grow: 1;
`;

const Sell = ({ token }: SellProps) => {
  const [open, setOpen] = useState(false);
  const { formatMessage } = useIntl();
  const belongsToUser = useTokenBelongsToUser();
  const cannotSell = useCannotSell();
  const track = useMarketplaceEvents();
  const cannotSellValue = useMemo(() => cannotSell(token), [token, cannotSell]);

  const { myMintedSingleSaleOffer, tradeableStatus } = token;

  if (!belongsToUser(token) || myMintedSingleSaleOffer) return null;

  return (
    <TokenTransferValidator tokens={[token]} transferContext="list">
      {({ validationMessages }) => (
        <>
          <Tooltip
            disableFocusListener
            title={
              Object.keys(validationMessages).length === 0 ? (
                <Text16 color="var(--c-neutral-1000)">
                  {formatMessage(cannotSellValue || messages[tradeableStatus])}
                </Text16>
              ) : (
                ''
              )
            }
          >
            <Root>
              <ListButton
                disabled={Boolean(cannotSellValue)}
                onClick={() => {
                  setOpen(true);
                  track('Click List Card', {
                    cardSlug: token.slug,
                    hasWarnings: Object.keys(validationMessages).length > 0,
                  });
                }}
                color="white"
                medium
                startIcon={
                  validationMessages[token.slug] && (
                    <Tooltip title={validationMessages[token.slug]}>
                      <FontAwesomeIcon icon={faWarning} />
                    </Tooltip>
                  )
                }
              >
                <FormattedMessage id="Sell.cta" defaultMessage="List my Card" />
              </ListButton>
            </Root>
          </Tooltip>
          {open && (
            <NewSaleDialog
              open={open}
              onClose={() => setOpen(false)}
              token={token}
            />
          )}
        </>
      )}
    </TokenTransferValidator>
  );
};

Sell.fragments = {
  token: gql`
    fragment SellCard_token on Token {
      assetId
      slug
      tradeableStatus
      myMintedSingleSaleOffer {
        id
      }
      owner {
        id
        settleAt
      }
      ...useTokenBelongsToUser_token
      ...useCannotSell_token
      ...NewSaleDialog_token
    }
    ${useCannotSell.fragments.token}
    ${useTokenBelongsToUser.fragments.token}
    ${NewSaleDialog.fragments.token}
  ` as TypedDocumentNode<SellCard_token>,
};

export default Sell;
