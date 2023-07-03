import { Container } from '@sorare/core/src/atoms/container';

import { MarketRoot } from '@sorare/marketplace/src/components/market/ui';

export const PageTemplate: React.FC = ({ children }) => {
  return (
    <div>
      <MarketRoot>
        <Container>{children}</Container>
      </MarketRoot>
    </div>
  );
};

export default PageTemplate;
