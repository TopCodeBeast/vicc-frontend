import classnames from 'classnames';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { glossary } from '@sorare/core/src/lib/glossary';

import loadingSVGUrl from './loading.svg';

export interface Props {
  error?: string;
  style?: any;
  small?: boolean;
  smaller?: boolean;
  fullHeight?: boolean;
  white?: boolean;
  grow?: boolean;
  fullScreen?: boolean;
}

const Container = styled.div<{ $white?: boolean }>`
  position: relative;
  color: inherit;
  width: 1em;
  height: 1em;
  & > img {
    display: block;
    width: 100%;
    height: 100%;
    .dark-theme & {
      ${({ $white }) =>
        !$white &&
        css`
          filter: invert(1);
        `}
    }
    ${({ $white }) =>
      $white &&
      css`
        filter: invert(1);
      `}
  }
`;

export const BaseLoadingIndicator = ({ white }: Pick<Props, 'white'>) => {
  const { formatMessage } = useIntl();
  return (
    <Container aria-label={formatMessage(glossary.loading)} $white={white}>
      <img src={loadingSVGUrl} alt="" />
    </Container>
  );
};

const Root = styled.div`
  background-color: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  vertical-align: top;
  &.fullHeight {
    height: 100vh;
  }
  &.fullHeight.white {
    background-color: var(--c-neutral-1000);
  }
  &.grow {
    flex: 1;
  }
  &.fullScreen {
    position: fixed;
    inset: 0;
    overflow: auto;
    z-index: 10;
    background: var(--c-neutral-100);
  }
`;
const Error = styled.span``;
const StyledContainer = styled.span`
  position: relative;
  font-size: calc(8 * var(--unit));
  ${Root}.small & {
    font-size: calc(4 * var(--unit));
  }
  ${Root}.smaller & {
    font-size: calc(2 * var(--unit));
  }
  & img {
    width: 100%;
    height: 100%;
  }
`;

const LoadingIndicator = ({
  error,
  style = null,
  small,
  smaller,
  fullHeight,
  fullScreen,
  white,
  grow,
}: Props) => {
  return (
    <Root
      className={classnames({
        small,
        smaller,
        fullHeight,
        fullScreen,
        grow,
      })}
      style={style}
    >
      {error ? (
        <Error>{error}</Error>
      ) : (
        <StyledContainer>
          <BaseLoadingIndicator white={white} />
        </StyledContainer>
      )}
    </Root>
  );
};

export default LoadingIndicator;
