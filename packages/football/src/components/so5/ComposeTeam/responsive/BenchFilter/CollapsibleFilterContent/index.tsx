import styled from 'styled-components';

import { Collapsible } from '@sorare/core/src/atoms/layout/Collapsible';

import FilterContent from '@football/components/so5/ComposeTeam/responsive/BenchFilter/FilterContent';

const Root = styled.div`
  padding-top: var(--double-unit);
`;
const Content = styled.div`
  padding: var(--triple-unit) var(--double-unit);
  display: flex;
  flex-direction: column;
  background: var(--c-neutral-200);
  border-radius: var(--double-unit);
`;

type Props = {
  open: boolean;
};

const CollapsibleFilterContent = ({ open }: Props) => {
  return (
    <Collapsible open={open}>
      <Root>
        <Content>
          <FilterContent />
        </Content>
      </Root>
    </Collapsible>
  );
};

export default CollapsibleFilterContent;
