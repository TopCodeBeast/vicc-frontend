import { TypedDocumentNode, gql } from '@apollo/client';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';

import Vicc5TransferValidator from './So5TransferValidator';
import { TokenTransferValidator_token } from './__generated__/index.graphql';
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
    <Vicc5TransferValidator
      transferContext={transferContext}
      slugs={tokens
        .filter(({ sport }) => sport === Sport.CRICKET)
        .map(({ slug }) => slug)}
    >
      {children}
    </Vicc5TransferValidator>
  );
};

TokenTransferValidator.fragments = {
  token: gql`
    fragment TokenTransferValidator_token on Token {
      assetId
      slug
      sport
    }
  ` as TypedDocumentNode<TokenTransferValidator_token>,
};
