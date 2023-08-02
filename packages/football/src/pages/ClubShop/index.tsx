import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { PageHeader } from '@sorare/core/src/components/navigation/PageHeader';
import { FOOTBALL_PLAY } from '@sorare/core/src/constants/routes';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { navLabels } from '@sorare/core/src/lib/glossary';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Header from './Header';
import Tabs from './Tabs';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  flex: 1;
  overflow: hidden;
  background: var(--c-neutral-100);
  @media ${laptopAndAbove} {
    gap: 0;
  }
`;

export const ClubShop = () => {
  const isReorgApp = useIsReorgApp();
  return (
    <>
      {isReorgApp && (
        <PageHeader
          title={<FormattedMessage {...navLabels.clubshop} />}
          defaultBackTo={FOOTBALL_PLAY}
        />
      )}

      <Root>
        <Header />
        <Tabs />
      </Root>
    </>
  );
};

export default ClubShop;
