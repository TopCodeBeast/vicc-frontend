import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonBase, Collapse } from '@material-ui/core';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import useToggle from '@core/hooks/useToggle';

type Props = {
  title: ReactNode;
  children: ReactNode;
  startsOpen?: boolean;
  rounded?: boolean;
  noBorder?: boolean;
  noBorderWhenExpanded?: boolean;
  noHorizontalPadding?: boolean;
  noTopPadding?: boolean;
};

const Root = styled.div<{
  noBorder?: boolean;
}>`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);

  ${({ noBorder }) =>
    !noBorder &&
    css`
      border-bottom: 1px solid var(--c-neutral-200);
    `}
`;

const StyledButtonBase = styled(ButtonBase)<{ $noHorizontalPadding?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${({ $noHorizontalPadding }) =>
    $noHorizontalPadding
      ? `var(--intermediate-unit) 0`
      : `var(--intermediate-unit) var(--double-unit) var(--intermediate-unit) var(--intermediate-unit)`};
  gap: var(--double-unit);
`;

const Details = styled.div<{
  $noHorizontalPadding?: boolean;
  $noTopPadding?: boolean;
}>`
  --padding: var(--intermediate-unit);
  ${({ $noTopPadding }) =>
    `--top-padding: ${$noTopPadding ? '0' : 'var(--padding)'};`}

  padding: ${({ $noHorizontalPadding }) =>
    $noHorizontalPadding
      ? `var(--top-padding) 0 var(--padding) 0`
      : `var(--top-padding) var(--padding) var(--padding)`};
`;

const Icon = styled(FontAwesomeIcon)<{ $expanded: boolean }>`
  color: var(--c-neutral-600);
  fill: var(--c-neutral-600);
  transform: rotate(0deg);
  transition: 0.3s transform;

  ${({ $expanded }) =>
    $expanded &&
    css`
      transform: rotate(-180deg);
    `}

  .dark-theme & {
    color: var(--c-static-neutral-500);
  }
`;

export const Accordion = ({
  title,
  startsOpen = false,
  noBorder,
  noBorderWhenExpanded,
  noHorizontalPadding,
  noTopPadding,
  children,
}: Props) => {
  const [expanded, toggleExpanded] = useToggle(startsOpen);

  return (
    <Root noBorder={(noBorderWhenExpanded && !expanded) || noBorder}>
      <StyledButtonBase
        onClick={toggleExpanded}
        disableRipple
        $noHorizontalPadding={noHorizontalPadding}
      >
        {title}
        <Icon icon={faChevronDown} $expanded={expanded} />
      </StyledButtonBase>
      <Collapse in={expanded} collapsedSize={0}>
        <Details
          $noHorizontalPadding={noHorizontalPadding}
          $noTopPadding={noTopPadding}
        >
          {children}
        </Details>
      </Collapse>
    </Root>
  );
};

export const FilterAccordion = ({
  title,
  children,
  startsOpen,
  noBorder,
}: {
  title?: ReactNode;
  children: ReactNode;
  startsOpen?: boolean;
  noBorder?: boolean;
}) => {
  if (title) {
    return (
      <Accordion
        title={title}
        startsOpen={startsOpen}
        noHorizontalPadding
        noTopPadding
        noBorder={noBorder}
        noBorderWhenExpanded
      >
        {children}
      </Accordion>
    );
  }

  return (
    <Root noBorder>
      <Details $noHorizontalPadding>{children}</Details>
    </Root>
  );
};

export default Accordion;
