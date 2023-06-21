import { gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Scrollable from '@sorare/core/src/components/Scrollable';
import { FOOTBALL_VIDEOS } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { range } from '@sorare/core/src/lib/arrays';

import { HomeBlock } from '@football/components/Home/Block';

import { ContentUnit } from './ContentUnit';
import { ManagerHomeContentUnits } from './__generated__/index.graphql';
import useHideContentUnit from './useHideContentUnit';

type ContentUnit = Omit<
  ManagerHomeContentUnits['config']['so5']['managerHomeContentUnitsSets'][number]['contentUnits'][number],
  '__typename'
>;

type Props = {
  loading: boolean;
};

const StyledScrollable = styled(Scrollable)`
  --mask-size: calc(6 * var(--unit));
`;

const QUERY = gql`
  query ManagerHomeContentUnits {
    config {
      id
      so5 {
        id
        managerHomeContentUnitsSets {
          id
          contentUnits {
            id
            title
            subtitle
            primaryButtonLabel
            primaryButtonUrl
            illustrationUrl
            videoUrl
          }
        }
      }
    }
  }
`;

export const ContentUnits = ({ loading: homeLoading }: Props) => {
  const { hide: hideContentUnit, hiddenUnits } = useHideContentUnit();
  const { data, loading } = useQuery<ManagerHomeContentUnits>(QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const contentUnitsSet = data?.config.so5.managerHomeContentUnitsSets?.[0];
  const contentUnits: ContentUnit[] =
    contentUnitsSet?.contentUnits ||
    range(3).map(id => ({
      id: `_${id}`,
      title: '\u00a0',
      subtitle: '',
      primaryButtonLabel: '',
      primaryButtonUrl: '',
      illustrationUrl: null,
      videoUrl: null,
    }));
  const unitEntriesToDisplay = contentUnits.filter(
    ({ id }) => !hiddenUnits.includes(id)
  );

  if (contentUnitsSet?.contentUnits.length === 0 && !loading) {
    return null;
  }
  return (
    <HomeBlock loading={loading || homeLoading}>
      <StyledScrollable withMask itemToDisplay={3}>
        {unitEntriesToDisplay.map(
          ({
            id,
            title,
            subtitle,
            primaryButtonLabel,
            primaryButtonUrl,
            illustrationUrl,
            videoUrl,
          }) => {
            return (
              <ContentUnit
                key={id}
                title={title}
                subtitle={subtitle}
                illustration={illustrationUrl}
                to={
                  videoUrl
                    ? `${generatePath(FOOTBALL_VIDEOS, {
                        slug: 'external',
                      })}?src=${encodeURIComponent(videoUrl)}`
                    : primaryButtonUrl
                }
                cta={primaryButtonLabel}
                onHide={() => {
                  hideContentUnit(id);
                }}
              />
            );
          }
        )}
      </StyledScrollable>
    </HomeBlock>
  );
};
