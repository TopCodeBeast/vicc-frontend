import sorareLogo from './assets/sorareLogo.png';

type Props = { className?: string };

export const RotatingStarball = ({ className }: Props) => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={sorareLogo}
      className={className}
    >
      <source
        src="https://frontend-assets.sorare.com/baseball/draft/completion/starball-hevc-safari.mp4"
        type='video/mp4; codecs="hvc1"'
      />
      <source
        src="https://frontend-assets.sorare.com/baseball/draft/completion/starball-vp9-chrome.webm"
        type="video/webm"
      />
    </video>
  );
};
