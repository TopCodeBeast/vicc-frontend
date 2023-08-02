import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { IconButton } from '@sorare/core/src/atoms/buttons/IconButton';
import { Container } from '@sorare/core/src/atoms/container';
import { FOOTBALL_MARKET } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { Link } from '@sorare/core/src/routing/Link';

import { MarketRoot } from '@sorare/marketplace/src/components/market/ui';

const GoBack = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: inherit;
  margin-left: calc(var(--unit) * -1); /** Cancel button padding */
`;
export const PageTemplate: React.FC<
  React.PropsWithChildren<{ showBack?: boolean }>
> = ({ children, showBack }) => {
  const { currentUser } = useCurrentUserContext();
  const isReorgApp = useIsReorgApp();
  if (isReorgApp) {
    return <>{children}</>;
  }
  return (
    <MarketRoot noMargin={!currentUser}>
      <Container>
        <div>
          {!currentUser && showBack && (
            <GoBack to={FOOTBALL_MARKET}>
              <IconButton
                component="div"
                color="transparent"
                icon={faArrowLeft}
              />
              <FormattedMessage
                id="TransferMarket.PageTemplate.goBack"
                defaultMessage="Go back"
              />
            </GoBack>
          )}
          {children}
        </div>
      </Container>
    </MarketRoot>
  );
};

export default PageTemplate;
