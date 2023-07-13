export const cardSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type CardSize = (typeof cardSizes)[number];
