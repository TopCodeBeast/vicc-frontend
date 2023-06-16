import { Link as LinkComponent } from 'react-router-dom';

const createLink = (to: string) => {
  return function Link(...chunks: string[]) {
    return <LinkComponent to={to}>{chunks}</LinkComponent>;
  };
};

export default createLink;
