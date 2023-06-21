import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

import DetailsDialog from '@football/components/collections/DetailsDialog';
import howPointsWork from '@football/components/collections/assets/how-points-work.png';

import { DetailsDialogBanner_cardCollection } from './__generated__/index.graphql';

const Banner = styled.button`
  border: 2px solid var(--c-neutral-300);
  border-bottom-width: 4px;
  border-radius: 12px;
  padding: var(--double-unit);
  width: 100%;
  text-align: left;
  background: var(--c-neutral-400) url(${howPointsWork}) no-repeat right center;
  background-size: 110px;
`;

type Props = { cardCollection?: DetailsDialogBanner_cardCollection };
const DetailsDialogBanner = ({ cardCollection }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Banner onClick={() => setOpen(true)} type="button">
        <Text16 bold>
          <FormattedMessage
            id="collections.DetailsDialogBanner.cta"
            defaultMessage="How points work"
          />
        </Text16>
      </Banner>
      <DetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        cardCollection={cardCollection}
      />
    </>
  );
};

export default DetailsDialogBanner;

DetailsDialogBanner.fragments = {
  cardCollection: gql`
    fragment DetailsDialogBanner_cardCollection on CardCollection {
      slug
      ...DetailsDialog_cardCollection
    }
    ${DetailsDialog.fragments.cardCollection}
  `,
};
