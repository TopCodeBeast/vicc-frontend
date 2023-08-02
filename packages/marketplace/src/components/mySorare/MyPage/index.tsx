import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { desktopAndAbove } from '@sorare/core/src/style/mediaQuery';

import MySorareMarketplaceProvider from '@marketplace/contexts/MySorareMarketplace';

import { HEADERS, MySorarePage } from '../common/pages';

interface Props {
  page: MySorarePage;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}

const Header = styled.div`
  margin-bottom: var(--triple-unit);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
`;
const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--unit);
  @media ${desktopAndAbove} {
    align-items: flex-end;
    justify-content: right;
  }
`;

export const MyPage = ({ page, children, toolbar }: Props) => {
  return (
    <MySorareMarketplaceProvider>
      <Header>
        <Title2>
          <FormattedMessage {...HEADERS[page]} />
        </Title2>
        {toolbar && <Toolbar>{toolbar}</Toolbar>}
      </Header>
      {children}
    </MySorareMarketplaceProvider>
  );
};

export default MyPage;
