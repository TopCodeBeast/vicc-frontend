import { Tab, Tabs } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SmallContainer } from '@sorare/core/src/atoms/container';
import TabContainer from '@sorare/core/src/atoms/layout/TabContainer';
import { Title2 } from '@sorare/core/src/atoms/typography';
import MultiSportAppBar from 'routing/MultiSportAppBar';
import MultiSportBottomNavBar from 'routing/MultiSportBottomNavBar';
import MultiSportFooter from 'routing/MultiSportFooter';

export type Tab = {
  value: string;
  label: ReactNode;
  content: ReactNode;
  href: string;
};

type Props = {
  title: string;
  defaultTab?: string;
  tabs: Tab[];
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;
const StyledContainer = styled(SmallContainer)`
  padding-top: var(--double-unit);
  flex: 1;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

export const Layout = ({ title, defaultTab, tabs }: Props) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(
    defaultTab || tabs[0].value
  );

  return (
    <Root>
      <MultiSportAppBar />
      <StyledContainer>
        <InnerContainer>
          <Title2>{title}</Title2>
          <div>
            <Tabs
              value={activeTab}
              onChange={(_event, val) => {
                setActiveTab(val);
              }}
            >
              {tabs.map(tab => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  component={Link}
                  to={tab.href}
                />
              ))}
            </Tabs>
            <TabContainer>
              {tabs.find(tab => tab.value === activeTab)?.content}
            </TabContainer>
          </div>
        </InnerContainer>
      </StyledContainer>
      <MultiSportFooter />
      <MultiSportBottomNavBar />
    </Root>
  );
};
