import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Button } from '@core/atoms/buttons/Button';
import { Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import { breakpoints, laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled(ContentContainer)`
  margin-top: calc(var(--unit) * 5);
  @media ${tabletAndAbove} {
    margin-top: calc(var(--unit) * 14);
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-family: 'Druk Wide';
  text-transform: uppercase;
  text-align: center;
  line-height: 1;
  margin-bottom: calc(var(--unit) * 7);

  @media ${tabletAndAbove} {
    font-size: 40px;
    margin-bottom: calc(var(--unit) * 14);
  }
  @media ${laptopAndAbove} {
    font-size: 56px;
  }
`;

const BlockList = styled.div`
  display: grid;
  gap: calc(var(--unit) * 7);

  @media ${tabletAndAbove} {
    gap: calc(var(--unit) * 10);
  }

  @media ${laptopAndAbove} {
    gap: 0;
  }
`;

const BlockWrapper = styled.div`
  display: grid;
  border: 1px solid var(--c-static-neutral-800);

  @media ${laptopAndAbove} {
    grid-template-columns: 1fr 3fr;
    grid-template-areas: 'text image';
    gap: calc(var(--unit) * 5);
    padding: calc(var(--unit) * 5);
    &.reverse {
      grid-template-columns: 3fr 1fr;
      grid-template-areas: ' image text';
    }
  }
`;

const BlockContent = styled.div`
  padding: var(--triple-unit) var(--double-and-a-half-unit);

  @media ${tabletAndAbove} {
    display: grid;
    gap: calc(var(--unit) * 5);
    grid-template-columns: 1fr 2fr;
    row-gap: var(--double-and-a-half-unit);
    padding: var(--quadruple-unit) var(--double-and-a-half-unit);
  }

  @media ${laptopAndAbove} {
    display: flex;
    grid-area: text;
    gap: var(--double-unit);
    flex-direction: column;
    text-align: left;
    padding: 0;
  }
`;

const BlockNumber = styled(Text18)`
  display: flex;
  font-size: 16px;
  line-height: 1.5;
  align-items: center;

  @media ${laptopAndAbove} {
    font-size: 18px;
  }
`;

const Line = styled.span`
  flex-grow: 1;
  height: 1px;
  background: var(--c-neutral-100);
  margin-left: 16px;
`;

const BlockTitle = styled.h3`
  font-size: 20px;
  line-height: 1;
  font-family: 'Druk Wide';
  text-transform: uppercase;
  margin-top: var(--double-and-a-half-unit);

  @media ${tabletAndAbove} {
    font-size: 24px;
    margin-top: var(--unit);
  }

  @media ${laptopAndAbove} {
    margin-top: var(--double-unit);
  }
`;

const BlockText = styled(Text18)`
  font-size: 16px;
  line-height: 1.5;
  margin-top: var(--unit);

  @media ${laptopAndAbove} {
    font-size: 18px;
  }
`;

const Picture = styled.picture`
  grid-row: 1;
  align-self: center;
  position: relative;

  @media ${laptopAndAbove} {
    grid-row: auto;
    grid-area: image;
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;

  @media ${tabletAndAbove} {
    aspect-ratio: 1.7;
  }

  @media ${laptopAndAbove} {
    grid-row: auto;
    border-radius: var(--double-unit);
  }
`;

const Video = styled.video`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  align-self: center;
  grid-row: 1;

  @media ${tabletAndAbove} {
    aspect-ratio: initial;
  }

  @media ${laptopAndAbove} {
    grid-row: auto;
    grid-area: image;
    border-radius: var(--double-unit);
  }
`;

const CTA = styled.div`
  margin-top: var(--double-unit);
  @media ${tabletAndAbove} {
    margin-top: 0;
  }
  @media ${laptopAndAbove} {
    margin-top: var(--double-unit);
  }
`;

type BlockWithCtaAction = {
  title: string;
  text: string | ReactNode;
  cta: string;
  ctaAction: () => void;
  imageSrc: { default: string; mobile?: string; tablet?: string };
  videoSrc?: string;
};

type BlockWithoutCtaAction = {
  title: string;
  text: string | ReactNode;
  cta?: never;
  ctaAction?: never;
  imageSrc: { default: string; mobile?: string; tablet?: string };
  videoSrc?: string;
};

type Block = BlockWithCtaAction | BlockWithoutCtaAction;

type Props = {
  title: string;
  blocks: Block[];
};

export const ExperienceBlock = ({ title, blocks }: Props) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <BlockList>
        {blocks.map((block, index) => (
          <BlockWrapper
            key={block.title}
            className={classNames({ reverse: index % 2 })}
          >
            <BlockContent>
              <div>
                <BlockNumber
                  color="var(--c-static-neutral-600)"
                  className={classNames({ reverse: index % 2 })}
                >
                  0{index + 1}
                  <Line />
                </BlockNumber>
                <BlockTitle>{block.title}</BlockTitle>
              </div>
              <BlockText color="var(--c-static-neutral-600)">
                {block.text}
              </BlockText>
              {block.cta && (
                <CTA>
                  <Button color="white" medium onClick={block?.ctaAction}>
                    {block.cta}
                  </Button>
                </CTA>
              )}
            </BlockContent>
            {block.videoSrc ? (
              <Video
                loop
                muted
                autoPlay
                playsInline
                poster={block.imageSrc.default}
              >
                <source src={block.videoSrc} type="video/webm" />
              </Video>
            ) : (
              <Picture>
                {block.imageSrc.mobile && (
                  <source
                    media={`(max-width: ${breakpoints.tablet}px)`}
                    srcSet={block.imageSrc.mobile}
                  />
                )}
                <Image src={block.imageSrc.default} alt={block.title} />
              </Picture>
            )}
          </BlockWrapper>
        ))}
      </BlockList>
    </Wrapper>
  );
};
