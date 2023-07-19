export const useFootballEvents = () => {
  return (a: any, b?: any) => {
    console.log('FootballEvents', a, b);
  }
}

export const getInteractionContext = () => {
  return 'InteractionContext';
};

export enum socialShareEventContext {
  CARD_PAGE,
  LEADERBOARD,
  SQUAD,
}

export enum socialShareEventName {
  SHARE_CARD,
  SHARE_LINEUP,
  SHARE_SQUAD,
}

export type SocialShareEventContext = any;
export type SocialShareEventName = any;
export const shareByCopyLinkEvent = (...params: any) => ({} as any);
export const shareByImageEvent = (...params: any) => ({} as any);
export const shareOnFacebookEvent = (...params: any) => ({} as any);
export const shareOnTwitterEvent = (...params: any) => ({} as any);
export const shareWithShareSheetEvent = (...params: any) => ({} as any);