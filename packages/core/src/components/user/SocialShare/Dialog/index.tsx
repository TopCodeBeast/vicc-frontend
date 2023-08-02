import { TypedDocumentNode, gql } from '@apollo/client';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faArrowUpFromBracket,
  faDownload,
  faEllipsis,
  faLink,
  faTimes,
} from '@fortawesome/pro-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import RoundedButton from '@core/atoms/buttons/RoundedButton';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import Dots from '@core/atoms/navigation/Dots';
import { Text14, Title3 } from '@core/atoms/typography';
import Scrollable from '@core/components/Scrollable';
import Dialog from '@core/components/dialog';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useEventsContext } from '@core/contexts/events';
import { useIntlContext } from '@core/contexts/intl';
import { useSportContext } from '@core/contexts/sport';
import idFromObject from '@core/gql/idFromObject';
import useUtmParams, {
  UTM_CAMPAIGNS,
  UTM_MEDIUMS,
  UTM_SOURCES,
  getUtmTermFromSport,
} from '@core/hooks/useUtmParams';
import {
  SocialShareEventContext,
  SocialShareEventName,
  shareByCopyLinkEvent,
  shareByImageEvent,
  shareOnFacebookEvent,
  shareOnTwitterEvent,
  shareWithShareSheetEvent,
} from '@core/lib/events';
import { glossary } from '@core/lib/glossary';
import { ImageVariations } from '@core/lib/share';

import useShareSheet from '../useShareSheet';
import { SocialShare_SocialPictures_Dialog } from './__generated__/index.graphql';

const messages = defineMessages({
  copyLink: {
    id: 'SocialShareDialog.clipboard',
    defaultMessage: 'Copy link',
  },
  copied: {
    id: 'SocialShareDialog.copied',
    defaultMessage: 'Copied!',
  },
});

const Aside = styled.aside`
  display: flex;
  justify-content: space-between;
  margin-bottom: auto;
  > *:first-child:last-child {
    margin-left: auto;
  }
`;
const Header = styled.header`
  text-align: center;
  margin-bottom: var(--quadruple-unit);
`;
const DialogContent = styled.div`
  padding: var(--double-unit) var(--double-unit) var(--quadruple-unit);
  text-align: center;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Buttons = styled.div`
  display: flex;
  gap: var(--double-unit);
  justify-content: center;
  margin-bottom: auto;
`;
const ScrollableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  padding: var(--unit);
  margin-bottom: var(--quadruple-unit);
`;
const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  z-index: 1;
`;
const ImgWrapper = styled.figure`
  isolation: isolate;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90%;
  height: 300px;
  margin: auto;
`;
const Loader = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const buildShareUrl = (
  type: 'twitter' | 'facebook',
  url: string,
  text?: string
) => {
  switch (type) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text || '')}`;
    case 'facebook':
      return `https://www.facebook.com/dialog/share?app_id=966242223397117&href=${encodeURIComponent(
        url
      )}`;
    default:
      return url;
  }
};

type Props = {
  opened: boolean;
  close: () => void;
  title: string;
  description?: string;
  message?: string;
  image?: Omit<
    SocialShare_SocialPictures_Dialog['socialPictureUrls'],
    '__typename'
  >;
  shareProps: {
    url?: string;
    trackingEventName: SocialShareEventName;
    trackingEventContext: SocialShareEventContext;
    sharedItemId?: string;
    sharedItem?: UTM_CAMPAIGNS;
  };
};
const SocialShareDialog = ({
  opened,
  close,
  image,
  title,
  description,
  message,
  shareProps,
}: Props) => {
  const images = Object.entries(image || []).filter(
    ([variant, src]) => variant !== '__typename' && !!src
  ) as [ImageVariations, string][];
  const availableSteps = [
    shareProps.url ? 'share_link' : undefined,
    images.length ? 'select_image_to_share' : undefined,
  ].filter(Boolean) as ('share_link' | 'select_image_to_share')[];
  const defaultStep = availableSteps[0];
  const { currentUser } = useCurrentUserContext();
  const { sport } = useSportContext();
  const { formatMessage } = useIntlContext();
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const timeoutRef = useRef(setTimeout(() => {}, 0));
  const { track } = useEventsContext();
  const { setParams } = useUtmParams();
  const [step, setStep] = useState(defaultStep);
  const selectedImage = images[selectedImageIndex]?.[1];
  const shareSheetProps = {
    image: selectedImage,
    title: message,
    skip: !opened,
  };

  const sharedParams = {
    url: shareProps.url,
    medium: UTM_MEDIUMS.SOCIAL,
    term: getUtmTermFromSport(sport),
    user: idFromObject(currentUser?.id),
    content: shareProps.sharedItemId,
    campaign: shareProps.sharedItem,
  };
  const {
    share: shareWithShareSheet,
    enabled: shareSheetEnabled,
    loading: shareSheetLoading,
  } = useShareSheet({
    ...shareSheetProps,
    url: setParams({
      ...sharedParams,
    }),
  });
  const trackingProps = [
    shareProps.trackingEventName,
    shareProps.trackingEventContext,
  ] as const;
  const copyToClipboard = () => {
    const clipboardUrl = setParams({ ...sharedParams });
    if (!clipboardUrl) return;
    const { name, properties } = shareByCopyLinkEvent(...trackingProps);
    track(name, properties);
    navigator.clipboard.writeText(clipboardUrl);
    clearTimeout(timeoutRef.current);
    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  };
  const onShareImageClick = () => {
    const { name, properties } = shareByImageEvent(...trackingProps);
    track(name, properties);
  };
  const onTwitterClick = () => {
    const { name, properties } = shareOnTwitterEvent(...trackingProps);
    track(name, properties);
  };
  const onFacebookClick = () => {
    const { name, properties } = shareOnFacebookEvent(...trackingProps);
    track(name, properties);
  };
  const onShareSheetClick = () => {
    const { name, properties } = shareWithShareSheetEvent(...trackingProps);
    track(name, properties);
    shareWithShareSheet();
  };

  useEffect(() => {
    // Need that useEffect to prevent a display glitch
    if (opened) {
      setStep(defaultStep);
    }
  }, [opened, defaultStep]);

  return (
    <Dialog onClose={close} open={opened} maxWidth="sm" fullWidth>
      <DialogContent>
        <Aside>
          {availableSteps.length > 1 && step !== 'share_link' && (
            <IconButton
              color="white"
              icon={faArrowLeft}
              onClick={() => setStep('share_link')}
              aria-label={formatMessage({ ...glossary.back })}
            />
          )}
          <IconButton
            color="white"
            icon={faTimes}
            onClick={close}
            aria-label={formatMessage({ ...glossary.close })}
          />
        </Aside>
        <Header>
          <Title3>{title}</Title3>
          {description && <Text14>{description}</Text14>}
        </Header>
        {step === 'share_link' ? (
          <Buttons>
            <RoundedButton
              href={buildShareUrl(
                'twitter',
                setParams({
                  ...sharedParams,
                  source: UTM_SOURCES.TWITTER,
                }),
                message
              )}
              onClick={onTwitterClick}
              color="var(--c-social-twitter)"
              icon={faTwitter}
              label="Twitter"
            />
            <RoundedButton
              href={buildShareUrl(
                'facebook',
                setParams({
                  ...sharedParams,
                  source: UTM_SOURCES.FACEBOOK,
                })
              )}
              onClick={onFacebookClick}
              color="var(--c-social-facebook)"
              icon={faFacebook}
              label="Facebook"
            />
            <RoundedButton
              onClick={copyToClipboard}
              color="var(--c-static-neutral-700)"
              icon={faLink}
              label={copied ? messages.copied : glossary.copy}
            />
            {!!images.length && (
              <RoundedButton
                onClick={() => setStep('select_image_to_share')}
                color="var(--c-static-neutral-700)"
                label={glossary.more}
                icon={faEllipsis}
              />
            )}
            {!images.length && shareSheetEnabled && (
              <RoundedButton
                onClick={onShareSheetClick}
                color="var(--c-static-neutral-700)"
                label={glossary.share}
                icon={faEllipsis}
              />
            )}
          </Buttons>
        ) : (
          <>
            <ScrollableWrapper>
              <Scrollable
                itemToDisplay={1}
                onVisibleItemsChanged={items => {
                  setSelectedImageIndex(items[0]);
                }}
                indexToScroll={selectedImageIndex}
              >
                {images.map(([, src]) => (
                  <ImgWrapper key={src}>
                    <Img src={src} alt="" />
                    <Loader>
                      <LoadingIndicator small />
                    </Loader>
                  </ImgWrapper>
                ))}
              </Scrollable>
              <Dots
                selectedIndex={selectedImageIndex}
                setSelectedIndex={setSelectedImageIndex}
                titles={images.map(([type]) => type)}
              />
            </ScrollableWrapper>
            <Buttons>
              {!!selectedImage && (
                <RoundedButton
                  href={selectedImage}
                  download
                  onClick={onShareImageClick}
                  color="var(--c-static-neutral-700)"
                  icon={faDownload}
                  label={glossary.download}
                />
              )}
              {shareSheetEnabled && (
                <RoundedButton
                  onClick={onShareSheetClick}
                  color="var(--c-brand-600)"
                  icon={faArrowUpFromBracket}
                  label={glossary.share}
                  disabled={shareSheetLoading}
                />
              )}
            </Buttons>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

SocialShareDialog.fragments = {
  socialPictures: gql`
    fragment SocialShare_SocialPictures_Dialog on SocialPicturesInterface {
      socialPictureUrls {
        post
        square
        story
      }
    }
  ` as TypedDocumentNode<SocialShare_SocialPictures_Dialog>,
};

export default SocialShareDialog;
