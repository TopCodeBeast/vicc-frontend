import { TypedDocumentNode, gql } from '@apollo/client';
import { faMemo } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Skeleton } from '@sorare/core/src/atoms/animations/Skeleton';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { range } from '@sorare/core/src/lib/arrays';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import useGetPriceHistory from '../../../hooks/useGetPriceHistory';
import PriceHistoryDate from '../PriceHistoryDate';
import { PriceHistoryTooltip_token } from './__generated__/index.graphql';

const PriceHistoryList = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: auto;
  gap: var(--unit);
  flex-wrap: wrap;
`;

const Row = styled.div`
  min-width: 120px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--double-unit);
`;

const messages = defineMessages({
  title: {
    id: 'PriceHistoryTooltip.title',
    defaultMessage: 'Last {rarity} sales',
  },
});

export const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TitlePart = styled(Text14)`
  text-align: left;
  font-weight: bold;
`;

export const TooltipTitle = styled(TitlePart)`
  text-transform: lowercase;

  &::first-letter {
    text-transform: uppercase;
  }
`;

const TextGrey = styled.span`
  color: var(--c-neutral-600);
`;

const PriceHistoryValueContainer = styled(Text14)<{ rarity: Rarity }>`
  font-weight: bold;
  color: var(--c-neutral-1000);
  line-height: 19px;
`;

const TextSkeleton = styled(Skeleton)`
  height: 14px;
  width: 40px;
  background-color: #3a3a3a;
  background-image: linear-gradient(90deg, #212020, #3a3a3a, #212020);
`;

interface PriceHistoryProps {
  token: PriceHistoryTooltip_token;
}

const Loader = () => {
  return (
    <>
      {range(5).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Row key={i}>
          <TextGrey>
            <TextSkeleton />
          </TextGrey>
          <TextGrey>
            <TextSkeleton />
          </TextGrey>
        </Row>
      ))}
    </>
  );
};

const PriceHistoryTooltipContent = ({ token, ...rest }: PriceHistoryProps) => {
  const { formatMessage } = useIntl();
  const { up: isTablet } = useScreenSize('tablet');
  const { metadata, collection } = token;
  const { data, loading } = useGetPriceHistory({
    rarity: metadata.rarity,
    collection,
    playerSlug: metadata.playerSlug,
  });

  if (data && data?.tokens.tokenPrices.length === 0) {
    return (
      <PriceHistoryList {...rest}>
        <FormattedMessage
          id="PriceHistoryTooltip.noResult"
          defaultMessage="No results found"
        />
      </PriceHistoryList>
    );
  }

  return (
    <PriceHistoryList {...rest}>
      <Title>
        <TooltipTitle>
          <FormattedMessage
            {...messages.title}
            values={{
              rarity: formatMessage(scarcityMessages[metadata.rarity]),
            }}
          />
        </TooltipTitle>
        {!isTablet && (
          <TitlePart>&nbsp;- {metadata.playerDisplayName}</TitlePart>
        )}
      </Title>
      {loading || !data?.tokens ? (
        <Loader />
      ) : (
        data.tokens.tokenPrices.map(priceHistorySample => (
          <Row key={priceHistorySample.date}>
            <TextGrey>
              <PriceHistoryDate date={priceHistorySample.date} />
            </TextGrey>
            <PriceHistoryValueContainer as="span" rarity={metadata.rarity}>
              <AmountWithConversion
                monetaryAmount={priceHistorySample.amounts}
                column
                hideExponent
              />
            </PriceHistoryValueContainer>
          </Row>
        ))
      )}
    </PriceHistoryList>
  );
};

const ToolipContainer = styled(IconButton).attrs({
  disableDebounce: true,
  size: 'small',
})`
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: var(--double-unit);
  width: var(--double-unit);
  border-radius: 50%;
  margin-left: auto;

  svg {
    color: var(--c-neutral-1000);
  }
`;

const StyledPriceHistoryList = styled(PriceHistoryTooltipContent)`
  padding: var(--triple-unit);
  color: var(--c-neutral-1000);
  & ${PriceHistoryValueContainer} {
    color: var(--c-neutral-1000);
  }
  & ${TextGrey} {
    color: var(--c-neutral-600);
    font-size: 12px;
  }
`;

const PriceHistoryTooltip = ({
  token,
  ...rest
}: {
  token: PriceHistoryTooltip_token;
}) => {
  const { up: isTablet } = useScreenSize('tablet');
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const track = useEvents();
  if (isTablet)
    return (
      <Tooltip
        placement="top"
        onClick={e => e.preventDefault()}
        title={<PriceHistoryTooltipContent token={token} />}
        {...rest}
      >
        <ToolipContainer>
          <FontAwesomeIcon icon={faMemo} size="xs" />
        </ToolipContainer>
      </Tooltip>
    );
  return (
    <Dropdown
      preventDefault
      onChange={() => {}}
      onOpen={() => {
        track('Reveal Price History On Offer', {
          cardSlug: token.slug,
        });
        setDropdownOpened(true);
      }}
      label={
        <ToolipContainer {...rest}>
          <FontAwesomeIcon icon={faMemo} />
        </ToolipContainer>
      }
    >
      {dropdownOpened ? <StyledPriceHistoryList token={token} /> : <div />}
    </Dropdown>
  );
};

PriceHistoryTooltip.fragments = {
  token: gql`
    fragment PriceHistoryTooltip_token on Token {
      assetId
      slug
      collection
      metadata {
        ... on TokenMetadataInterface {
          id
          rarity
          playerSlug
          playerDisplayName
        }
      }
    }
  ` as TypedDocumentNode<PriceHistoryTooltip_token>,
};

export default PriceHistoryTooltip;
