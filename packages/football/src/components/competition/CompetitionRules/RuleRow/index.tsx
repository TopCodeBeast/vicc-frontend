import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const IconWrapper = styled.div`
  width: 28px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export type Props = {
  icon?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  requirement?: ReactNode;
};

export const RuleRow = ({ icon, label, description, requirement }: Props) => {
  return (
    <Wrapper>
      {icon ? <IconWrapper>{icon}</IconWrapper> : null}
      <Content>
        <Text16 color="var(--c-neutral-1000)" as="div">
          {label}
        </Text16>
        {description && (
          <Text14 color="var(--c-neutral-600)" as="div">
            {description}
          </Text14>
        )}
      </Content>
      {requirement ? (
        <Text16 color="var(--c-neutral-600)" as="div">
          {requirement}
        </Text16>
      ) : null}
    </Wrapper>
  );
};
