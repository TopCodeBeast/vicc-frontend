import React from 'react';

type FontFace = {
  family: string;
  weight?: string;
};

type FontOptions = {
  timeout: number;
};

const useFontFaceObserver = (fonts: FontFace[], options: FontOptions) => {
  return 'active';
  // return 'initial';
};

export default useFontFaceObserver;
