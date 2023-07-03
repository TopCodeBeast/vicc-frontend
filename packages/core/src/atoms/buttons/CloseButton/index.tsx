import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { IconButton, Props as IconButtonProps } from '@core/atoms/buttons/IconButton';
import { glossary } from '@core/lib/glossary';

interface Props extends Omit<IconButtonProps, 'color' | 'classes'> {
  onClose: (...args: any[]) => any;
  fixed?: boolean;
  transparent?: boolean;
  menu?: boolean;
}

const Root = styled(IconButton)`
  position: sticky;
  &.fixed {
    position: absolute;
    top: var(--double-unit);
    right: var(--double-unit);
    z-index: 10;
    &.menu {
      top: var(--unit);
      right: var(--unit);
    }
  }
`;

export const CloseButton = (props: Props) => {
  const { formatMessage } = useIntl();
  const {
    onClose,
    fixed,
    menu,
    transparent = false,
    className,
    ...rest
  } = props;

  return (
    <Root
      {...rest}
      color={transparent ? 'opa' : 'white'}
      icon={faTimes}
      onClick={onClose}
      className={classnames(
        {
          fixed,
          menu,
        },
        className
      )}
      aria-label={formatMessage(glossary.close)}
    />
  );
};

export default CloseButton;
