import { gql } from '@apollo/client';
import { Collapse } from '@material-ui/core';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Text14, Text16, Title5 } from '@sorare/core/src/atoms/typography';
import UninteractiveToken from '@sorare/core/src/components/token/UninteractiveToken';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useToggle from '@sorare/core/src/hooks/useToggle';

import TokenDrawerSummary from '@sorare/marketplace/src/components/buyActions/TokenDrawerSummary';
import TokenPriceHistory from '@sorare/marketplace/src/components/price/TokenPriceHistory';
import TokenDescription from '@sorare/marketplace/src/components/token/TokenDescription';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import { TokenSummary_token } from './__generated__/index.graphql';

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Row = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Image = styled.div`
  flex-shrink: 0;
  width: 52px;
`;

const Metas = styled.div`
  flex-grow: 1;
`;

const Gap = styled.div`
  height: var(--double-unit);
  display: inline-block;
`;

type Props = {
  token: TokenSummary_token;
  title?: ReactNode;
  price?: ReactNode;
  withoutRecentSales?: boolean;
};

export const TokenSummary = ({
  token,
  title,
  price,
  withoutRecentSales = false,
}: Props) => {
  const [viewRecentSales, toggleViewRecentSales] = useToggle(false);
  const { TokenTeamsComponent = () => null } = useMarketplaceContext();

  const { up: isLaptop } = useScreenSize('laptop');

  return (
    <div>
      <Summary>
        {title}
        <Row>
          <Image>
            <UninteractiveToken token={token} />
          </Image>
          <Metas>
            <TokenDescription
              withoutLink
              Title={Text16}
              titleColor="var(--c-neutral-1000)"
              detailsColor="var(--c-neutral-600)"
              Details={Text14}
              token={token}
            />
            <TokenTeamsComponent assetId={token.assetId} />
            {!withoutRecentSales && token.metadata.rarity !== Rarity.unique && (
              <button type="button" onClick={toggleViewRecentSales}>
                <Text14 color="var(--c-brand-600)">
                  {isLaptop && viewRecentSales ? (
                    <FormattedMessage
                      id="tokenSummary.recentSales.hide"
                      defaultMessage="Hide recent sales"
                    />
                  ) : (
                    <FormattedMessage
                      id="tokenSummary.recentSales.cta"
                      defaultMessage="View recent sales"
                    />
                  )}
                </Text14>
              </button>
            )}
          </Metas>
          {price}
        </Row>
      </Summary>
      {!isLaptop ? (
        <TokenDrawerSummary
          open={viewRecentSales}
          onBackdropClick={toggleViewRecentSales}
          title={
            <Title5>
              <FormattedMessage
                id="tokenSummary.recentSalesDrawer.title"
                defaultMessage="Recent Sales"
              />
            </Title5>
          }
        >
          <TokenPriceHistory context="buy_modal" token={token} />
        </TokenDrawerSummary>
      ) : (
        <Collapse in={viewRecentSales} collapsedSize={0}>
          <Gap />
          <TokenPriceHistory context="buy_modal" token={token} />
        </Collapse>
      )}
    </div>
  );
};

TokenSummary.fragments = {
  token: gql`
    fragment TokenSummary_token on Token {
      assetId
      slug
      ...TokenDescription_token
      ...UninteractiveToken_token
      ...TokenPriceHistory_token
    }
    ${UninteractiveToken.fragments.token}
    ${TokenDescription.fragments.token}
    ${TokenPriceHistory.fragments.token}
  `,
};

export default TokenSummary;
