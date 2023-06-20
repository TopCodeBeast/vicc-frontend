import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: var(--double-unit);
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  border-radius: 50%;
  background-color: var(--c-neutral-400);
  padding: var(--unit);
`;

type Props = {
  icon: IconDefinition;
  title?: ReactNode;
  desc?: ReactNode;
};

export const ReinsuranceItem = ({ title, desc, icon }: Props) => {
  return (
    <Wrapper>
      <StyledFontAwesomeIcon
        icon={icon}
        size="sm"
        color="var(--c-neutral-1000)"
      />
      <div>
        {title && (
          <Text16 bold color="var(--c-neutral-1000)">
            {title}
          </Text16>
        )}
        {desc && <Text16 color="var(--c-neutral-600)">{desc}</Text16>}
      </div>
    </Wrapper>
  );
};

export default ReinsuranceItem;
