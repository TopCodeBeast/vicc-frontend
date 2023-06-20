const pseudoRandomUUID = () =>
  '10000000-1000-4000-8000-100000000000'.replace(
    /[018]/g,
    c => {
      const digit = parseInt(c, 10);
      /* eslint-disable no-bitwise */
      return (
        digit ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (digit / 4)))
      ).toString(16);
    }
    /* eslint-enable  no-bitwise */
  );

export const randomUUID = crypto.randomUUID
  ? crypto.randomUUID.bind(crypto)
  : pseudoRandomUUID;
