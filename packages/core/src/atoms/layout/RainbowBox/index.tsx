import styled, { css } from 'styled-components';

export const rainbow = css`
  background: var(--inside, linear-gradient(white, var(--c-neutral-100)))
      padding-box,
    linear-gradient(var(--c-neutral-100), var(--c-neutral-100)) padding-box,
    var(
        --border,
        linear-gradient(
          84.1deg,
          #f8d3da 0%,
          #b3a9f4 28.32%,
          #fbe9fb 54.01%,
          #4f94fd 100%
        )
      )
      border-box;
  .dark-theme & {
    --border: linear-gradient(90deg, #ffc700, #db00ff 63.2%, #0038ff 100%);
  }
`;

export const RainbowBox = styled.div`
  ${rainbow}
  border-radius: var(--unit);
  border: 1px solid transparent;
`;
