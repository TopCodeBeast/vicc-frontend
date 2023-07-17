import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  OwnerTransfer,
  TokenAuction,
  TokenOffer,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary } from '@sorare/core/src/lib/glossary';
import { isA } from '@sorare/core/src/lib/gql';
import { transferTypes } from '@sorare/core/src/lib/owners';

import { useOwnerAccount } from '@marketplace/hooks/tokens/useOwnerAccount';

import { TokenOwnerPrice } from '../TokenOwnerPrice';
// import { AuctionOwnershipDetails } from './AuctionOwnershipDetails';
// import { DirectOfferOwnershipDetails } from './DirectOfferOwnershipDetails';
import { Ownership_tokenOwner } from './__generated__/index.graphql';

type Props = {
  owner: Ownership_tokenOwner;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
  padding: var(--intermediate-unit);
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
`;
const DetailsContent = styled.div`
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
`;

export const Ownership = ({ owner }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const { formatDistanceToNow, formatDate } = useIntlContext();
  const { up: laptop } = useScreenSize('laptop');

  const date = parseISO(owner.from);
  const auction = isA<TokenAuction>('TokenAuction', owner.deal)
    ? owner.deal
    : undefined;
  const directOffer =
    isA<TokenOffer>('TokenOffer', owner.deal) &&
    owner.transferType === OwnerTransfer.DIRECT_OFFER
      ? owner.deal
      : undefined;

  const showViewMore = (auction && auction.bidsCount > 1) || directOffer;
  const ownerAccount = useOwnerAccount(owner as any); //TODO*****************

  return (
    <Root>
      <div>
        <Row>
          <Content>
            {ownerAccount?.avatar}
            <div>
              <Text16>
                <FormattedMessage
                  {...transferTypes[owner.transferType]}
                  values={{
                    owner: ownerAccount?.owner,
                  }}
                />
              </Text16>
              <Tooltip
                title={formatDate(date, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              >
                <Caption color="var(--c-neutral-600)">
                  {formatDistanceToNow(date)}
                </Caption>
              </Tooltip>
            </div>
            {laptop && showViewMore && !showDetails && (
              <Button
                color="darkGray"
                small
                onClick={() => setShowDetails(true)}
              >
                <FormattedMessage {...glossary.viewMore} />
              </Button>
            )}
          </Content>
          <div>
            <TokenOwnerPrice tokenOwner={owner} />
          </div>
        </Row>
      </div>
      {/* {showDetails && (
        <DetailsContent>
          {auction && <AuctionOwnershipDetails auction={auction} />}
          {directOffer && <DirectOfferOwnershipDetails offer={directOffer} />}
        </DetailsContent>
      )} */}
    </Root>
  );
};

Ownership.fragments = {
  tokenOwner: gql`
    fragment Ownership_tokenOwner on TokenOwner {
      id
      from
      transferType
      ...TokenOwnerPrice_tokenOwner
      account {
        id
        ...useOwnerAccount_account
      }
      deal {
        ... on TokenAuction {
          id
          bidsCount
        }
        ... on TokenOffer {
          id
        }
      }
    }
    ${useOwnerAccount.fragments.account}
    ${TokenOwnerPrice.fragments.tokenOwner}
  `,
};

export default Ownership;
