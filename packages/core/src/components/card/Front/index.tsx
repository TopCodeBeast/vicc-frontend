import styled from 'styled-components';

type Props = {
  src: string;
  alt?: string;
};

const Root = styled.img`
  max-width: 100%;
`;

export const CardFront = ({ src, alt = '' }: Props) => {
  return <Root src={src} alt={alt} />;
};

export default CardFront;
