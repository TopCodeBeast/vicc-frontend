import { CSSProperties } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  background: var(--c-neutral-1000);
  border: 2px solid var(--background-color);
  border-radius: var(--half-unit);
  box-sizing: content-box;
  width: var(--double-and-a-half-unit);
  height: var(--double-and-a-half-unit);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--half-unit);

  & > img {
    width: var(--double-unit);
    height: var(--double-unit);
    object-fit: contain;
  }

  &:before {
    position: absolute;
    top: calc(-1 * var(--unit));
    content: '';
    background-color: var(--background-color);
    width: 2px;
    height: var(--unit);
  }
`;

type Props = { clubIconUrl: string; isCompleted: boolean; alt: string };

export const ClubIcon = ({ clubIconUrl, isCompleted, alt }: Props) => {
  return (
    <Wrapper
      style={
        {
          '--background-color': isCompleted
            ? 'var(--c-green-600)'
            : 'var(--c-static-neutral-600)',
        } as CSSProperties
      }
    >
      <img src={clubIconUrl} alt={alt} />
    </Wrapper>
  );
};
