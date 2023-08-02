import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import Accordion from '@sorare/core/src/atoms/layout/Accordion';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';

const Root = styled.div`
  background-color: var(--c-neutral-300);
  border-radius: var(--unit);
`;
const Layout = styled.div`
  display: grid;
  grid-template-areas: 'icon title' 'icon subtitle';
  grid-template-columns: min-content 1fr;
  align-items: center;
  column-gap: var(--double-unit);
`;
const Icon = styled.div`
  grid-area: icon;
`;
const Title = styled(Text16)`
  grid-area: title;
  text-align: left;
`;
const Subtitle = styled(Text14)`
  grid-area: subtitle;
  text-align: left;
`;
const Content = styled(Text14)`
  text-align: left;
`;

type Props = {
  icon: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
};
const Section: FC<React.PropsWithChildren<Props>> = ({
  icon,
  title,
  subtitle,
  children,
}) => {
  return (
    <Root>
      <Accordion
        title={
          <Layout>
            <Icon>{icon}</Icon>
            <Title bold>{title}</Title>
            <Subtitle color="var(--c-neutral-600)">{subtitle}</Subtitle>
          </Layout>
        }
        noBorder
      >
        <Content as="div" color="var(--c-neutral-600)">
          {children}
        </Content>
      </Accordion>
    </Root>
  );
};

export default Section;
