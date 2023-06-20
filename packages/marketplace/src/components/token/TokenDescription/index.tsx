import { gql } from '@apollo/client';
import { ReactNode, useMemo } from 'react';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { Text16, TypographyVariant } from '@sorare/core/src/atoms/typography';
import TokenDescriptionFromProps from '@sorare/core/src/components/token/TokenDescriptionFromProps';
import TokenMetas from '@sorare/core/src/components/token/TokenMetas';
import { LEGACY_PLAYER_SHOW } from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { Color } from '@sorare/core/src/style/types';

import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import { TokenDescription_token } from './__generated__/index.graphql';

type Props = {
  token: TokenDescription_token;
  separator?: ReactNode;
  Title?: TypographyVariant;
  titleColor?: Color;
  Details?: TypographyVariant;
  detailsColor?: Color;
  withDetails?: boolean;
  withoutLink?: boolean;
  row?: boolean;
  disableSportSpecific?: boolean;
};

const TokenDescription = ({
  token,
  Title = Text16,
  titleColor = 'var(--c-neutral-1000)',
  separator = <> &ndash; </>,
  Details = Title,
  detailsColor = titleColor,
  withoutLink = false,
  withDetails = false,
  disableSportSpecific = false,
  ...styleProps
}: Props) => {
  const { metadata, sport } = token;
  const marketplaceContext = useMarketplaceContext();

  const MobileTokenDetailsComponent =
    marketplaceContext?.MobileTokenDetailsComponent;

  const tokenDetails = withDetails &&
    !disableSportSpecific &&
    MobileTokenDetailsComponent && (
      <MobileTokenDetailsComponent assetId={token.assetId} />
    );

  const TokenMetasDatas = useMemo(() => {
    return <TokenMetas token={token} separator={separator} />;
  }, [token, separator]);

  const { generateSportPath } = useSportContext();

  return (
    <TokenDescriptionFromProps
      displayName={metadata.playerDisplayName}
      path={generateSportPath(LEGACY_PLAYER_SHOW, {
        params: { slug: metadata.playerSlug },
        sport,
      })}
      description={TokenMetasDatas}
      withoutLink={withoutLink}
      Details={Details}
      detailsColor={detailsColor}
      Title={Title}
      titleColor={titleColor}
      {...(tokenDetails && { tokenDetails })}
      {...styleProps}
    />
  );
};

TokenDescription.fragments = {
  token: gql`
    fragment TokenDescription_token on Token {
      assetId
      slug
      sport
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          playerDisplayName
          playerSlug
        }
      }
      ...TokenDescription_tokenMetas
    }
    ${TokenMetas.fragments.token}
  `,
};

export default TokenDescription;
