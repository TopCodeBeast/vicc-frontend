import { gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { SettlementDelayReason } from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text16 } from '@sorare/core/src/atoms/typography';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import useTokenBelongsToUser from '@sorare/core/src/hooks/useTokenBelongsToUser';
import { isTransferable } from '@sorare/core/src/lib/deal';
import { glossary } from '@sorare/core/src/lib/glossary';

import { UnavailableAfterConversionCreditBuyHelpers_token } from './__generated__/index.graphql';

type Props = {
  token: UnavailableAfterConversionCreditBuyHelpers_token;
};

const Helpers = styled.div`
  display: inline-flex;
  gap: var(--unit);
  color: var(--c-neutral-600);
`;
const HelperText = styled(Text16)`
  display: flex;
`;

const UnavailableAfterConversionCreditBuyHelpers = ({ token }: Props) => {
  const tokenBelongsToUser = useTokenBelongsToUser();
  const belongsToUser = tokenBelongsToUser(token);
  const { formatMessage } = useIntl();
  if (
    !token?.owner?.settleAt ||
    token?.owner?.settlementDelayReason !==
      SettlementDelayReason.CONVERSION_CREDIT_USED ||
    isTransferable(token)
  )
    return null;
  const endDate = parseISO(token.owner.settleAt);

  return (
    <Helpers>
      <HelperText bold>
        {belongsToUser ? (
          <FormattedMessage
            id="UnavailableAfterConversionCreditBuyHelpers.owner"
            defaultMessage="Can be listed in"
          />
        ) : (
          <FormattedMessage
            id="UnavailableAfterConversionCreditBuyHelpers.buyer"
            defaultMessage="Available for trade in"
          />
        )}
        &nbsp;
        <TimeLeft
          time={endDate}
          endLabel={formatMessage(glossary.fewMoments)}
        />
      </HelperText>
      <Tooltip
        interactive
        placement="bottom"
        title={
          <FormattedMessage
            id="UnavailableAfterConversionCreditBuyHelpers.tooltip"
            defaultMessage="This Card was bought using a credit and can’t be listed for sale for {days} days."
            values={{ days: 7 }}
          />
        }
      >
        <div>
          <FontAwesomeIcon size="sm" icon={faInfoCircle} />
        </div>
      </Tooltip>
    </Helpers>
  );
};
UnavailableAfterConversionCreditBuyHelpers.fragments = {
  token: gql`
    fragment UnavailableAfterConversionCreditBuyHelpers_token on Token {
      assetId
      slug
      tradeableStatus
      owner {
        id
        settleAt
        settlementDelayReason
      }
      ...useTokenBelongsToUser_token
    }
    ${useTokenBelongsToUser.fragments.token}
  `,
};
export default UnavailableAfterConversionCreditBuyHelpers;
