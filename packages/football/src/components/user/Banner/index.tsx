import { TypedDocumentNode, gql } from '@apollo/client';
import styled, { css } from 'styled-components';

import { proxyUrl } from '@sorare/core/src/atoms/ui/ResponsiveImg';

import defaultBanner from 'assets/club/banner_none.jpg';

import { Banner_user } from './__generated__/index.graphql';

type Props = {
  user: Banner_user;
  rounded?: boolean;
};

const Root = styled.div<{ rounded?: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  ${props =>
    props.rounded &&
    css`
      border-radius: var(--intermediate-unit);
    `}

  &:after {
    position: absolute;
    content: '';
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, #0a0c14 63%);
    ${props =>
      props.rounded &&
      css`
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.4) 0%,
          var(--c-static-neutral-900) 63%
        );
        border-radius: var(--intermediate-unit);
      `}
  }
`;

export const Banner = ({ user, rounded }: Props) => (
  <Root
    style={{
      backgroundColor: `#${user.profile.clubBanner?.color || '2d348c'}`,
      backgroundImage: ` url(${
        user.profile.clubBanner?.pictureUrl
          ? proxyUrl(user.profile.clubBanner?.pictureUrl, {
              cropWidth: 1280,
              xl: true,
              dpis: 1,
            })
          : defaultBanner
      })`,
    }}
    rounded={rounded}
  />
);

Banner.fragments = {
  user: gql`
    fragment Banner_user on PublicUserInfoInterface {
      slug
      profile {
        id
        clubBanner {
          id
          color
          pictureUrl
        }
      }
    }
  ` as TypedDocumentNode<Banner_user>,
};

export default Banner;
