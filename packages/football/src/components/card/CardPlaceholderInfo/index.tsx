import { faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { LineupPosition } from '@sorare/core/src/lib/players';

import { positionShortNames } from '@football/lib/so5';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Icon = styled.div`
  margin-left: 6px; /* visual hack to override the + from the centering value */
`;

type Props = {
  position: LineupPosition;
};

const CardPlaceholderInfo = ({ position }: Props) => {
  return (
    <Root>
      <Icon>
        <FontAwesomeIcon icon={faUserPlus} size="lg" title={position} />
      </Icon>
      <Text16>
        <strong>
          {/* <FormattedMessage {...positionShortNames[position]} /> */}
          {position}
        </strong>
      </Text16>
    </Root>
  );
};

export default CardPlaceholderInfo;
