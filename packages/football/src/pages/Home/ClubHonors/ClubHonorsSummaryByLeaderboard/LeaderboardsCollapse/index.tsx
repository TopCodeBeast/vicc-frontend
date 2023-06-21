import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import Collapsible from '@sorare/core/src/atoms/layout/Collapsible';

const CollapsibleButton = styled.button`
  display: flex;
  gap: var(--unit);
  align-items: center;
  justify-content: center;
  padding: var(--double-unit) 0;
  color: var(--c-neutral-1000);
`;

const LeaderboardsCollapse = ({
  showMore,
  children,
}: {
  showMore?: boolean;
  children: ReactElement;
}) => {
  const [expanded, toggleExpanded] = useToggle(false);

  return !showMore ? (
    children
  ) : (
    <>
      <Collapsible
        open={expanded}
        options={{
          baseHeight: 325,
          fadeHeight: 100,
        }}
      >
        {children}
      </Collapsible>
      <CollapsibleButton onClick={toggleExpanded}>
        {expanded ? (
          <>
            <FormattedMessage
              id="ClubHonorsSummaryByLeaderboard.ShowLess"
              defaultMessage="Show less"
            />
            <FontAwesomeIcon icon={faChevronUp} />
          </>
        ) : (
          <>
            <FormattedMessage
              id="ClubHonorsSummaryByLeaderboard.ShowMore"
              defaultMessage="Show more"
            />
            <FontAwesomeIcon icon={faChevronDown} />
          </>
        )}
      </CollapsibleButton>
    </>
  );
};

export default LeaderboardsCollapse;
