import { faRandom } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';
import { fantasy } from '@core/lib/glossary';
import { theme } from '@core/style/theme';

import { LineupActionCta } from '../LineupActionCta';

const RedraftCtaMessage = styled.span<{ $hideLabelOnMobile: boolean }>`
  display: ${({ $hideLabelOnMobile }) =>
    $hideLabelOnMobile ? 'none' : 'initial'};

  @media (min-width: ${theme.breakpoints.values.mobile}px) {
    display: initial;
    margin-left: var(--unit);
  }
`;

type Props = {
  url: string;
  hideLabelOnMobile?: boolean;
};

export const RedraftCta = ({ url, hideLabelOnMobile = false }: Props) => {
  return (
    <Tooltip
      title={
        <Text14>
          <FormattedMessage
            id="Lobby.LineupActions.Tooltip.Redraft"
            defaultMessage="Draft again"
          />
        </Text14>
      }
      placement="top-end"
    >
      <LineupActionCta
        color="white"
        medium
        component={Link}
        state={{ sourcePage: 'lobby' }}
        to={url}
      >
        <FontAwesomeIcon icon={faRandom} />
        <RedraftCtaMessage $hideLabelOnMobile={hideLabelOnMobile}>
          <FormattedMessage {...fantasy.redraft} />
        </RedraftCtaMessage>
      </LineupActionCta>
    </Tooltip>
  );
};

export default RedraftCta;
