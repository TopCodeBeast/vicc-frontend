import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessageDescriptor, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Ineligible } from '@sorare/core/src/atoms/icons/Ineligible';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';

import TooltipContent from '@football/components/so5/CardProperties/TooltipContent';

const titleMessages = defineMessages({
  partial: {
    id: 'So5Eligibility.partial',
    defaultMessage: 'SO5 Partially eligible',
  },
  ineligible: {
    id: 'So5Eligibility.ineligible',
    defaultMessage: 'SO5 Ineligible',
  },
});

const PartialIcon = styled.div`
  position: relative;
  z-index: 0;
  color: white;
  font-size: 11;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::after {
    content: '';
    background-color: var(--c-brand-600);
    inset: 0;
    margin: 3px;
    border-radius: 2px;
    z-index: -1;
    position: absolute;
    transform: rotateZ(45deg);
  }
`;

type Props = {
  partial?: boolean;
  description: MessageDescriptor;
};

export const So5Eligibility = ({ description, partial }: Props) => {
  const { formatMessage } = useIntl();
  const title = partial ? titleMessages.partial : titleMessages.ineligible;

  return (
    <Tooltip title={<TooltipContent title={title} description={description} />}>
      {partial ? (
        <PartialIcon>
          <FontAwesomeIcon icon={faTimes} title={formatMessage(title)} />
        </PartialIcon>
      ) : (
        <Ineligible title={formatMessage(title)} />
      )}
    </Tooltip>
  );
};

export default So5Eligibility;
