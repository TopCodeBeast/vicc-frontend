import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { DetailedScoreKey } from '@core/components/collections/DetailedScoreLine';
import { DetailsDialog } from '@core/components/collections/DetailsDialog';
import howPointsWork from '@core/components/collections/assets/how-points-work.png';
import { CollectionsTeamShield } from '@core/lib/collections';

const BannerWrapper = styled.button`
  width: 100%;
  padding: var(--double-unit);
  text-align: left;
  background-color: var(--c-neutral-100);
  background-image: url(${howPointsWork});
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 110px;
  border-color: var(--c-neutral-400);
  border-style: solid;
  border-width: 2px 2px var(--half-unit);
  border-radius: var(--intermediate-unit);
  transition: background-color 0.1s ease-in-out;
  &:hover {
    background-color: rgba(var(--c-rgb-neutral-1000), 0.05);
  }
  .dark-theme & {
    background-color: var(--c-neutral-400);
    border-color: var(--c-neutral-300);
  }
`;

const CompactWrapper = styled.button`
  display: flex;
  gap: var(--unit);
  align-items: center;
  color: var(--c-neutral-600);
  transition: color 0.1s ease-in-out;
  &:hover,
  &:focus {
    color: var(--c-neutral-700);
  }
`;

type Props = {
  teamShield?: CollectionsTeamShield;
  showScoreLines?: DetailedScoreKey[];
  compact?: boolean;
};

export const DetailsDialogBanner = ({
  teamShield,
  showScoreLines,
  compact,
}: Props) => {
  const [open, setOpen] = useState(false);
  const Wrapper = compact ? CompactWrapper : BannerWrapper;
  return (
    <>
      <Wrapper onClick={() => setOpen(true)} type="button">
        <Text16 bold={!compact}>
          <FormattedMessage
            id="collections.DetailsDialogBanner.cta"
            defaultMessage="How points work"
          />
        </Text16>
        {compact && <FontAwesomeIcon icon={faInfoCircle} size="xs" />}
      </Wrapper>
      <DetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        teamShield={teamShield}
        showScoreLines={showScoreLines}
      />
    </>
  );
};
