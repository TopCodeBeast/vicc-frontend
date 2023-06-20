import { VariantType } from './types';

export const backgroundColors: { [key in VariantType]: string } = {
  yellow: 'rgba(var(--c-rgb-yellow-600), 0.25)',
  green: 'rgba(var(--c-rgb-green-600), 0.25)',
  blue: 'rgba(var(--c-rgb-brand-600), 0.25)',
  grey: 'var(--c-neutral-300)',
  red: 'rgba(var(--c-rgb-red-600), 0.25)',
};

export const borderColor: { [key in VariantType]: string } = {
  yellow: 'var(--c-yellow-600)',
  green: 'var(--c-green-600)',
  blue: 'var(--c-brand-600)',
  grey: 'var(--c-neutral-600)',
  red: 'var(--c-red-600)',
};

export const fontColor: { [key in VariantType]: string } = {
  yellow: 'var(--c-yellow-800)',
  green: 'var(--c-green-800)',
  blue: 'var(--c-brand-800)',
  grey: 'var(--c-neutral-600)',
  red: 'var(--c-red-800)',
};
