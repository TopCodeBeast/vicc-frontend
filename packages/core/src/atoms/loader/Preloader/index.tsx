import Helmet from 'react-helmet';

type Props = {
  imageUrls?: string[];
  videoUrls?: string[];
};
export const Preloader = ({ imageUrls, videoUrls }: Props) => {
  if (!imageUrls?.length && !videoUrls?.length) {
    return null;
  }

  return (
    <Helmet>
      {[...new Set(imageUrls)].map(url => (
        <link rel="preload" as="image" key={url} href={url} />
      ))}
      {[...new Set(videoUrls)].map(url => (
        <link rel="preload" as="video" key={url} href={url} />
      ))}
    </Helmet>
  );
};
