import styled from 'styled-components';

import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { theme } from '@sorare/core/src/style/theme';

const Wrapper = styled.div`
  display: flex;
  justify-content: inital;
  padding: calc(7 * var(--unit)) var(--unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const TitleItem = styled.div`
  ${theme.styledFonts.drukWideSuper}
  font-size: 40px;
  line-height: 100%;
  text-transform: uppercase;
  word-break: break-word;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 80px;
  }
`;

export const CollectTitle = () => {
  const { formatMessage } = useIntlContext();
  return (
    <Wrapper>
      <TitleItem data-testid="title-item">
        {formatMessage(
          {
            id: 'Landing.CollectPlayWin',
            defaultMessage: 'Collect{br}Play{br}Win',
          },
          {
            br: <br />,
          }
        )}
      </TitleItem>
    </Wrapper>
  );
};
