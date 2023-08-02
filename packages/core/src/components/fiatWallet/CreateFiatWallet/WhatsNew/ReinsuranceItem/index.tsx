import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14, Text16 } from '@core/atoms/typography';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: var(--double-unit);
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  border-radius: var(--triple-unit);
  background-color: var(--c-neutral-400);
  padding: var(--unit);
  aspect-ratio: 1 / 1;
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
        {desc && <Text14 color="var(--c-neutral-600)">{desc}</Text14>}
      </div>
    </Wrapper>
  );
};

export default ReinsuranceItem;
