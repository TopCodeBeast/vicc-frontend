import React from 'react';

type FontFace = {
  family: string;
  weight?: string;
};

type FontOptions = {
  timeout: number;
};

const useFontFaceObserver = (fonts: FontFace[], options: FontOptions, errors: any) => {
  return 'active';
  // return 'initial';
};

export default useFontFaceObserver;
