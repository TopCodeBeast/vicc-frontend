export const toBase64 = (u8: Uint8Array) =>
  window.btoa(String.fromCharCode.apply(null, u8 as unknown as number[]));

export const fromBase64 = (str: string) =>
  new Uint8Array(
    window
      .atob(str)
      .split('')
      .map(c => c.charCodeAt(0))
  );
