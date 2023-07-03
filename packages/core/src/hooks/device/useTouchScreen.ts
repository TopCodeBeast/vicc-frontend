import { useMedia } from 'react-use';

const useTouchScreen = () =>
  useMedia('(hover: none) and (pointer: coarse)', false);

export default useTouchScreen;
