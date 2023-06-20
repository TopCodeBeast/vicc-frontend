import { toSnakeCase } from './toSnakeCase';

export const capitalize = (s: string) =>
  `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;

export default (str: string) => toSnakeCase(str).split('_').join(' ');

export const formatWord = (word: string) =>
  word.split('_').map(capitalize).join(' ');
