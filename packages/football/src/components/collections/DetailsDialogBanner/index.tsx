import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

import DetailsDialog from '@sorare/football/src/components/collections/DetailsDialog';
import howPointsWork from '@sorare/football/src/components/collections/assets/how-points-work.png';

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

const DetailsDialogBanner = () => {
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
      <DetailsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default DetailsDialogBanner;
