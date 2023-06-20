import { faClose } from '@fortawesome/pro-solid-svg-icons';
import {
  Navigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Dialog } from '@sorare/core/src/components/dialog';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { FOOTBALL_HOME } from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';

import thumbnailTutorial from 'assets/home/thumbnail_tutorial.jpg';

const DialogContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const VideoBox = styled.div`
  position: relative;
`;
const Video = styled.video`
  display: block;
  max-width: calc(100vw - 20px);
  max-height: 90vh;
  background: black; /* match video bg color */
  object-fit: cover;
`;

const CloseButtonBox = styled.div`
  position: absolute;
  top: var(--intermediate-unit);
  right: var(--intermediate-unit);
`;

const VIDEOS = {
  'football-beginner-guide': {
    poster: thumbnailTutorial,
    src: `${FRONTEND_ASSET_HOST}/football/tutorial_3_min_desktop.mp4`,
  },
};

const ManagerHomeVideos = () => {
  const bgLocation = useBgLocation();
  const location = useLocation();
  const back = useSafePreviousNavigate(FOOTBALL_HOME);
  const { slug }: { slug?: keyof typeof VIDEOS } = useParams();
  const [searchParams] = useSearchParams();
  const videoFromUrl = decodeURIComponent(searchParams.get('src') || '');
  const currentVideo = slug && VIDEOS[slug];

  if (!(currentVideo || videoFromUrl)) {
    return null;
  }
  if (!bgLocation) {
    // this is to always show something in the background if you are coming from
    // a direct link instead of in-app link
    return (
      <Navigate
        to={location.pathname + location.search}
        state={{ backgroundState: { pathname: FOOTBALL_HOME } }}
        replace
      />
    );
  }

  return (
    <Dialog onClose={back} maxWidth="lg" open fullWidth={false} darkTheme>
      <DialogContent>
        <VideoBox>
          <Video poster={currentVideo?.poster} width="1180px" controls autoPlay>
            <source src={videoFromUrl || currentVideo?.src} />
          </Video>
          <CloseButtonBox>
            <IconButton color="dark" icon={faClose} onClick={back} />
          </CloseButtonBox>
        </VideoBox>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerHomeVideos;
