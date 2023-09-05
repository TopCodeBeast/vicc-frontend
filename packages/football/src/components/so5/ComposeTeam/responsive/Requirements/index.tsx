import { TypedDocumentNode, gql } from '@apollo/client';
import { faInfoCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener } from '@material-ui/core';
import classnames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Tooltip } from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

import Context from '@football/components/so5/ComposeTeam/Context';
import Rules, { hasRules } from '@football/components/so5/Rules';

import { ComposeLineupTitle_vicc5Leaderboard } from './__generated__/index.graphql';

const StyledTooltip = styled.div`
  padding: 0;
  border: 1px solid transparent;
  max-width: 584px;
  margin: calc(-1 * var(--unit));
  & > * {
    padding: 10px;
  }
  & > * + * {
    border-top: 1px solid var(--c-neutral-400);
  }
`;
const Requirements = styled(Text14)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--c-neutral-100);
  cursor: help;
  &.error {
    color: var(--c-red-600);
  }
`;

export const Title = () => {
  const { vicc5Leaderboard, errors } = useContext(Context)!;
  const { displayedRules } = vicc5Leaderboard;
  const hasRequirements = hasRules(displayedRules);
  const [openTooltip, setOpenTooltip] = useState(false);
  const { up: isTablet } = useScreenSize('tablet');

  useEffect(() => {
    if (errors) {
      setOpenTooltip(true);
    }
  }, [errors]);

  if (!hasRequirements) {
    return null;
  }

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() => setOpenTooltip(false)}
    >
      <div
        onMouseEnter={() => {
          setOpenTooltip(true);
        }}
        onMouseLeave={() => {
          setOpenTooltip(false);
        }}
      >
        <Tooltip
          open={openTooltip}
          title={
            <StyledTooltip>
              <Rules vicc5Leaderboard={vicc5Leaderboard} errors={errors} />
            </StyledTooltip>
          }
        >
          <Requirements
            className={classnames({
              error: errors?.length,
            })}
          >
            {errors?.length ? (
              <FontAwesomeIcon icon={faTimesCircle} />
            ) : (
              <FontAwesomeIcon icon={faInfoCircle} />
            )}
            {isTablet && (
              <strong>
                <FormattedMessage
                  id="ComposeTeam.Title.Requirements"
                  defaultMessage="See requirements"
                />
              </strong>
            )}
          </Requirements>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

Title.fragments = {
  vicc5Leaderboard: gql`
    fragment ComposeLineupTitle_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      #...Rules_vicc5Leaderboard
    }
    #{Rules.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<ComposeLineupTitle_vicc5Leaderboard>,
};

export default Title;
