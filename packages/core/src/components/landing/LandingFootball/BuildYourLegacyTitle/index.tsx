import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

import { MixedFontTitle } from '../ui';

const messages = defineMessages({
  title: {
    id: 'BuildYourLegacyTitle.title',
    defaultMessage: '<span>Build your</span>{br}Legacy',
  },
  titleV2: {
    id: 'BuildYourLegacyTitle.titleV2',
    defaultMessage: 'COLLECT. PLAY. WIN.',
  },
});

const StyledMixedFontTitle = styled(MixedFontTitle)`
  font-size: 28px;
  span {
    font-size: 30px;
  }
  @media ${tabletAndAbove} {
    font-size: 70px;

    span {
      font-size: 80px;
    }
  }
`;

export const BuildYourLegacyTitle = ({ useV2 }: { useV2?: boolean }) => {
  const title = useV2 ? messages.titleV2 : messages.title;
  return (
    <StyledMixedFontTitle>
      <FormattedMessage
        {...title}
        values={{
          span: (...chunks: string[]) => {
            return <span>{chunks}</span>;
          },
          br: <br />,
        }}
      />
    </StyledMixedFontTitle>
  );
};
