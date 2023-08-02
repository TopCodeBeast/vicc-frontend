import styled from 'styled-components';

import { drukwideSuper } from '@core/components/marketing/typography';
import { useIntlContext } from '@core/contexts/intl';
import { tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  display: flex;
  justify-content: inital;
  padding: calc(7 * var(--unit)) var(--unit);

  @media ${tabletAndAbove} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const TitleItem = styled.div`
  ${drukwideSuper}
  font-size: 40px;
  line-height: 100%;
  text-transform: uppercase;
  word-break: break-word;

  @media ${tabletAndAbove} {
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
