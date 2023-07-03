import qs from 'qs';
import { ComponentProps, useState } from 'react';

const validWidths = [40, 80, 160, 320, 480, 640] as const;
const validXlWidths = [320, 640, 1280, 1920, 2560] as const;
export type ValidWidths = (typeof validWidths)[number];
type ValidXlWidths = (typeof validXlWidths)[number];
/**
 * Defines all the properties which may actually be injected and targetted towards Cloudflare resizing features.
 */
export type CloudflareResizeProps =
  | {
      cropWidth?: ValidWidths;
      xl?: false;
      dpis?: 1 | 2 | 3;
    }
  | {
      cropWidth?: ValidXlWidths;
      xl: true;
      dpis?: 1 | 2 | 3;
    };

type Props = Omit<ComponentProps<'img'>, 'src' | 'alt'> &
  CloudflareResizeProps & {
    src?: string;
    alt: string;
    fallback?: string;
  };

type CloudFlareOptions = {
  width?: number;
  xl?: boolean;
};

const resizableImgRegex = new RegExp(
  /(https:\/\/([-A-z]+.)?sorare.(com|dev))(.*)/
);
const cachedDpis = [1, 2, 3];

const cachedDpi =
  (window.devicePixelRatio &&
    cachedDpis.find(dpi => dpi >= window.devicePixelRatio)) ||
  1;

const getClosestWidth = (
  width: number,
  widths: readonly number[] = validWidths
) => widths.find(c => c >= width) || widths[widths.length - 1];

export const getClosestStandardWidth = (width: number) => {
  return getClosestWidth(width, validWidths) as ValidWidths;
};

const getValidWidth = (width: number, useXlWidths = false) => {
  const widths = useXlWidths ? validXlWidths : validWidths;
  if (
    ['test', 'development'].includes(import.meta.env.MODE) &&
    !(widths as readonly number[]).includes(width)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `CropWidth value should be one of ${widths.join(
        ', '
      )}, you passed ${width}`
    );
  }
  return getClosestWidth(width, widths);
};

const options = (
  props: Omit<CloudflareResizeProps, 'cropWidth'> & { cropWidth?: number }
) => {
  const cdnOptions: CloudFlareOptions = {};
  if (props.cropWidth) {
    const expectedWidth = props.cropWidth * (props.dpis || cachedDpi);
    cdnOptions.width = getValidWidth(expectedWidth, props.xl);
  }
  if (props.xl) {
    cdnOptions.xl = true;
  }
  return cdnOptions;
};

const relativeProxiableUrl = (url: string) =>
  url.startsWith('/') && import.meta.env.MODE !== 'development';

export const proxyUrl = (
  url: string,
  cdnQueryParams: CloudflareResizeProps
) => {
  if (relativeProxiableUrl(url))
    return `https://sorare.com/image-resize${url}${qs.stringify(
      options(cdnQueryParams),
      { addQueryPrefix: true }
    )}`;

  return url.replace(
    resizableImgRegex,
    `$1/image-resize$4${qs.stringify(options(cdnQueryParams), {
      addQueryPrefix: true,
    })}`
  );
};

/**
 * For sorare.com assets only (relative paths in staging/production or absolute sorare.com paths)
 * If a dimension is specified, it returns a resized image of that dimension
 * Otherwise it returns a simple optimized image (image max width is the screen width)
 * Cloudflare converts automatically to webP for browsers that support it
 */
const imageProps = (url: string | undefined, props: CloudflareResizeProps) => {
  if (!url || (!url.match(resizableImgRegex) && !relativeProxiableUrl(url))) {
    if (props.cropWidth) {
      // ensure validation is also done in tests & storybook
      getValidWidth(props.cropWidth, props.xl);
    }
    return { src: url };
  }
  if (props.cropWidth) return { src: proxyUrl(url, props) };

  return {
    src: url,
    srcSet: `${proxyUrl(url, {
      ...props,
      cropWidth: 320,
    })} 300w,
    ${proxyUrl(url, { ...props, cropWidth: 640 })} 600w,
    ${proxyUrl(url, { ...props, cropWidth: 640 })} 900w`,
  };
};

const Img = ({ src, alt, fallback, onError, ...rest }: Props) => {
  const [hasError, setHasError] = useState(false);
  const { cropWidth, xl, ...nonCloudflareProperties } = rest;

  return (
    <img
      {...(hasError
        ? { src: fallback }
        : imageProps(src, {
            cropWidth,
            xl,
          } as CloudflareResizeProps))}
      {...nonCloudflareProperties}
      onError={e => {
        setHasError(true);
        if (onError) {
          onError(e);
        }
      }}
      alt={alt}
    />
  );
};

const ResponsiveImg = ({ src, ...props }: Props) => {
  return <Img key={src} {...props} src={src} />;
};

export default ResponsiveImg;
