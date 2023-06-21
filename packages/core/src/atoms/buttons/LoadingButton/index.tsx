import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button, { Props as ButtonProps, Color } from '@core/atoms/buttons/Button';
import DotsLoader from '@core/atoms/loader/DotsLoader';
import { BaseLoadingIndicator } from '@core/atoms/loader/LoadingIndicator';
import { glossary } from '@core/lib/glossary';

export interface Props extends ButtonProps {
  loading: boolean;
  dots?: boolean;
}

const loadingIndicatorCustomizationsPerColor = (
  stroke: boolean | undefined,
  color: Color
) => {
  if (stroke) {
    return undefined;
  }
  const map: {
    [key in Color]?: { white?: boolean };
  } = {
    green: {
      white: true,
    },
    blue: {
      white: true,
    },
  };

  return map[color];
};

const Loading = styled.span`
  margin-left: 10px;
`;
const LoadingIndicator = styled.div`
  font-size: calc(3 * var(--unit));
  &.medium {
    font-size: calc(3 * var(--unit));
  }
  &.small {
    font-size: calc(2 * var(--unit));
  }
  &.compact {
    font-size: var(--unit);
  }
`;
const StyledButton = styled(Button)`
  position: relative;
`;
const Loader = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform ease-in-out 0.2s;
  ${StyledButton}.loading & {
    transform: translate(-50%, -50%) scale(1);
  }
`;
const Cta = styled.span`
  transition: transform ease-in-out 0.2s;
  ${StyledButton}.loading & {
    transform: scale(0);
  }
`;

const LoadingButton = ({
  loading,
  children,
  disabled,
  dots,
  className,
  small,
  medium,
  compact,
  ...rest
}: Props) => {
  const renderLoader = () => {
    if (dots) {
      return (
        <>
          <FormattedMessage {...glossary.loading} />
          <Loading className={classnames(rest.color)}>
            <DotsLoader />
          </Loading>
        </>
      );
    }
    return (
      <LoadingIndicator
        className={classnames({
          small,
          medium,
          compact,
        })}
      >
        <BaseLoadingIndicator
          white={rest.color === 'black'}
          {...(rest.color &&
            loadingIndicatorCustomizationsPerColor(rest.stroke, rest.color))}
        />
      </LoadingIndicator>
    );
  };

  return (
    <StyledButton
      disabled={disabled || loading}
      className={classnames(className, { loading })}
      small={small}
      medium={medium}
      compact={compact}
      {...rest}
    >
      {loading && <Loader>{renderLoader()}</Loader>}
      <Cta>{children}</Cta>
    </StyledButton>
  );
};

export default LoadingButton;
