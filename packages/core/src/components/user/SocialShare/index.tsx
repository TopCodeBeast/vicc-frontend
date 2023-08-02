import { TypedDocumentNode, gql } from '@apollo/client';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowUpFromBracket } from '@fortawesome/pro-solid-svg-icons';
import { ReactElement, useState } from 'react';
import { MessageDescriptor } from 'react-intl';

import Button, { Props as ButtonProps } from '@core/atoms/buttons/Button';
import { Share } from '@core/atoms/icons/Share';
import { useIntlContext } from '@core/contexts/intl';
import { UTM_CAMPAIGNS } from '@core/hooks/useUtmParams';
import { SocialShareEventContext, SocialShareEventName } from '@core/lib/events';
import { glossary } from '@core/lib/glossary';

import Dialog from './Dialog';
import { SocialShare_SocialPictures } from './__generated__/index.graphql';

type SocialShare_SocialPictures_socialPictureUrls = Omit<
  SocialShare_SocialPictures['socialPictureUrls'],
  '__typename'
>;
type Props = {
  url?: string;
  title?: string;
  description?: MessageDescriptor;
  message?: string;
  values?: any;
  image?: SocialShare_SocialPictures_socialPictureUrls;
  trackingEventName: SocialShareEventName;
  trackingEventContext: SocialShareEventContext;
  sharedItemId?: string;
  sharedItem?: UTM_CAMPAIGNS;
  renderButton: (props: {
    onClick: () => void;
    ShareButton: (props: ButtonProps) => ReactElement;
    Icon: ReactElement;
    icon: IconProp;
    label: string;
  }) => React.ReactNode;
};

export const SocialShare = (props: Props) => {
  const {
    title,
    description,
    url,
    image,
    message,
    renderButton,
    trackingEventName,
    trackingEventContext,
    sharedItemId,
    sharedItem,
  } = props;
  const [opened, setOpened] = useState(false);
  const { formatMessage } = useIntlContext();

  return (
    <>
      {renderButton({
        onClick: () => setOpened(!opened),
        ShareButton: ({ onClick: onButtonClick, ...rest }) => (
          <Button
            color="white"
            onClick={event => {
              setOpened(!opened);
              onButtonClick?.(event);
            }}
            aria-label={formatMessage(glossary.share)}
            {...rest}
          />
        ),
        Icon: <Share />,
        icon: faArrowUpFromBracket,
        label: formatMessage(glossary.share),
      })}
      <Dialog
        close={() => setOpened(false)}
        opened={opened}
        title={title || formatMessage(glossary.share)}
        description={description && formatMessage(description)}
        message={message}
        image={image}
        shareProps={{
          url,
          trackingEventName,
          trackingEventContext,
          sharedItemId,
          sharedItem,
        }}
      />
    </>
  );
};

SocialShare.fragments = {
  socialPictures: gql`
    fragment SocialShare_SocialPictures on SocialPicturesInterface {
      ...SocialShare_SocialPictures_Dialog
    }
    ${Dialog.fragments.socialPictures}
  ` as TypedDocumentNode<SocialShare_SocialPictures>,
};

export default SocialShare;
