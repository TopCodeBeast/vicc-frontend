import { useState } from 'react';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import GlareEffect from '@core/atoms/animations/GlareEffect';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import { CardScore } from '@core/components/collections/CardScore';
import DetailedScoreLine, {
  DetailedScoreKey,
  detailedScores,
} from '@core/components/collections/DetailedScoreLine';
import { DetailedScoresPreview } from '@core/components/collections/DetailedScoresPreview';
import { DetailsDialogBanner } from '@core/components/collections/DetailsDialogBanner';
import Warning from '@core/components/collections/Warning';
import Dialog from '@core/components/dialog';
import OpenItemDialogLink, { Item } from '@core/components/link/OpenItemDialogLink';
import { laptopAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
`;

const PictureWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(28 * var(--unit));
`;

const DialogWrapper = styled.div`
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--quadruple-unit) var(--double-unit) var(--double-unit);
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;

const TopRight = styled.div`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
`;

const DetailsScores = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  background: var(--c-neutral-300);
  border-radius: var(--double-unit);
`;

export type Props = {
  className?: string;
  item: Item;
  pictureUrl: string;
  score?: number;
  scoreByKey?: Partial<Record<DetailedScoreKey, number>>;
  listed?: boolean;
  loading?: boolean;
  sport: Sport;
  onUnlist?: () => Promise<void>;
};

export const CollectionFulfilledSlot = ({
  className,
  item,
  pictureUrl,
  score,
  scoreByKey,
  listed,
  loading,
  sport,
  onUnlist,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const scoreLineKeys = (
    Object.keys(scoreByKey ?? {}) as DetailedScoreKey[]
  ).filter(key => scoreByKey?.[key]);
  const showDialog = scoreLineKeys.length > 0;

  const cardLink = (
    <PictureWrapper>
      <OpenItemDialogLink item={item} sport={sport}>
        <GlareEffect pictureUrl={pictureUrl} />
      </OpenItemDialogLink>
    </PictureWrapper>
  );

  return (
    <Wrapper className={className}>
      {cardLink}
      {score !== undefined && (
        <Tooltip
          title={
            <DetailedScoresPreview scoreKeys={scoreLineKeys} listed={listed} />
          }
          PopperProps={{ className: 'dark-theme' }}
        >
          <CardScore
            score={score}
            listed={listed}
            onClick={showDialog && (() => setDialogOpen(true))}
          />
        </Tooltip>
      )}
      {score !== undefined && showDialog && (
        <Dialog
          open={dialogOpen}
          darkTheme={false}
          maxWidth="sm"
          hideHeader
          onClose={() => setDialogOpen(false)}
          body={({ CloseButton }) => (
            <DialogWrapper>
              <TopRight>
                <CloseButton onClose={() => setDialogOpen(false)} />
              </TopRight>
              {cardLink}
              <CardScore score={score} listed={listed} />
              <DetailsScores>
                {scoreLineKeys.map(key => (
                  <DetailedScoreLine
                    key={key}
                    {...detailedScores[key]}
                    listed={listed}
                  />
                ))}
              </DetailsScores>
              {listed && <Warning onClick={onUnlist} loading={loading} />}
              <DetailsDialogBanner showScoreLines={scoreLineKeys} />
            </DialogWrapper>
          )}
        />
      )}
    </Wrapper>
  );
};
