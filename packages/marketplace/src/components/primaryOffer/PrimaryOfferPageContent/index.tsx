import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { FullWidth } from '@sorare/core/src/atoms/container';
import { Title3 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import HandledError from '@sorare/core/src/routing/HandledError';

import MultiCardPageContent, {
  Section,
} from '@marketplace/components/market/MultiCardPageContent';
import PrimaryOfferSale from '@marketplace/components/primaryOffer/PrimaryOfferSale';
import { PrimaryOfferTokensPreview } from '@marketplace/components/primaryOffer/PrimaryOfferTokensPreview';

import { PrimaryOfferPageContent_primaryOffer } from './__generated__/index.graphql';

type Props = {
  primaryOffer: PrimaryOfferPageContent_primaryOffer | null;
  bundleProjection?: ReactNode;
  cardsPreview?: ReactNode;
  customPreview?: ReactNode;
};

export const PrimaryOfferPageContent = ({
  primaryOffer,
  bundleProjection,
  cardsPreview,
  customPreview,
}: Props) => {
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const { formatMessage } = useIntl();
  if (primaryOffer === null) {
    return (
      <FullWidth>
        <HandledError
          code={404}
          message={formatMessage({
            id: 'pack.notFound',
            defaultMessage: 'This pack does not exist',
          })}
        />
      </FullWidth>
    );
  }

  return (
    <MultiCardPageContent
      customPreview={customPreview}
      cardsPreview={<PrimaryOfferTokensPreview nfts={primaryOffer.nfts} />}
      detailsContent={
        <>
          {bundleProjection}
          <PrimaryOfferSale primaryOffer={primaryOffer} />
          <Section>
            <Title3>
              {isTabletOrDesktop ? (
                <FormattedMessage
                  id="StarterBundlePageContent.PlayersInThisPacks"
                  defaultMessage="Players in this pack"
                />
              ) : (
                <FormattedMessage
                  id="StarterBundlePageContent.InThisPacks"
                  defaultMessage="In this pack"
                />
              )}
            </Title3>
            {cardsPreview}
          </Section>
        </>
      }
    />
  );
};

PrimaryOfferPageContent.fragments = {
  primaryOffer: gql`
    fragment PrimaryOfferPageContent_primaryOffer on Offer {
      id
      nfts {
        assetId
        slug
        ...PrimaryOfferTokensPreview_token
      }
      ...PrimaryOfferSale_primaryOffer
    }
    ${PrimaryOfferSale.fragments.primaryOffer}
    ${PrimaryOfferTokensPreview.fragments.token}
  ` as TypedDocumentNode<PrimaryOfferPageContent_primaryOffer>,
};
export default PrimaryOfferPageContent;
