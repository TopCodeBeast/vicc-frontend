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
}

export enum socialShareEventName {
  SHARE_CARD,
}
  