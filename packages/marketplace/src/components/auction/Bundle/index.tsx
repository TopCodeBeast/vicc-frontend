import { faLayerGroup } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import { transferMarket } from '@sorare/core/src/lib/glossary';

const Root = styled.div`
  height: 27px;
  display: flex;
  align-items: center;
  color: var(--c-neutral-1000);
`;
const Icon = styled(FontAwesomeIcon)`
  color: var(--c-green-600);
  margin-right: 5px;
`;

export const Bundle = () => {
  return (
    <Root>
      <Icon icon={faLayerGroup} />
      <Caption bold>
        <FormattedMessage {...transferMarket.bundle} />
      </Caption>
    </Root>
  );
};

export default Bundle;
