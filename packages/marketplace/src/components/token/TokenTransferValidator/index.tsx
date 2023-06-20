import { gql } from '@apollo/client';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';

import So5TransferValidator from './So5TransferValidator';
import { TokenTransferValidatorProps } from './types';

export const TokenTransferValidator = ({
  tokens,
  children,
  shouldValidate = true,
  transferContext,
}: TokenTransferValidatorProps) => {
  if (!shouldValidate) {
    return (
      <>
        {children({
          validationMessages: {},
          loading: false,
        })}
      </>
    );
  }

  return (
    <So5TransferValidator
      transferContext={transferContext}
      slugs={tokens
        .filter(({ sport }) => sport === Sport.FOOTBALL)
        .map(({ slug }) => slug)}
    >
      {children}
    </So5TransferValidator>
  );
};

TokenTransferValidator.fragments = {
  token: gql`
    fragment TokenTransferValidator_token on Token {
      assetId
      slug
      sport
    }
  `,
};
