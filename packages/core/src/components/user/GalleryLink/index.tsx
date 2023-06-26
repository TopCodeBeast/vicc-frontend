import { gql } from '@apollo/client';
import { ComponentProps, FC, Fragment, PropsWithChildren } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import { LEGACY_USER_GALLERY } from '@core/constants/routes';
import { useSportContext } from '@core/contexts/sport';
import { galleryPathFromSport } from '@core/lib/galleryPathFromSport';

type UserWithGalleryPathFactory<T> = {
  user: T & { suspended: boolean };
  galleryPathFactory: (user: T) => string;
  galleryType?: never;
};

export type GalleryTypes = Sport;

type Props<T = never> = PropsWithChildren<
  (
    | UserWithGalleryPathFactory<T>
    | {
        user: { slug: string; suspended: boolean };
        galleryType?: GalleryTypes;
        galleryPathFactory?: never;
      }
  ) & {
    WhenSuspended?: FC;
  } & (
      | {
          Link?: never;
          className?: string;
        }
      | {
          Link?: FC<{ to: ComponentProps<typeof RouterLink>['to'] }>;
          className?: never;
        }
    )
>;

export const useCurrentSportGallery = () => {
  const { generateSportPath } = useSportContext();
  return ({ slug }: { slug: string }) =>
    generateSportPath(LEGACY_USER_GALLERY, {
      params: {
        slug,
      },
    });
};

export const GalleryLink = <T,>({
  user,
  galleryPathFactory,
  galleryType = Sport.FOOTBALL,
  children,
  Link,
  WhenSuspended = Fragment,
  className,
}: Props<T>) => {
  if (user.suspended) {
    return <WhenSuspended>{children}</WhenSuspended>;
  }
  const to = galleryPathFactory
    ? galleryPathFactory(user)
    : galleryPathFromSport(user.slug, galleryType);
  if (Link) {
    return <Link to={to}>{children}</Link>;
  }
  return (
    <RouterLink to={to} className={className}>
      {children}
    </RouterLink>
  );
};

GalleryLink.fragments = {
  user: gql`
    fragment GalleryLink_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      suspended
    }
  `,
};
