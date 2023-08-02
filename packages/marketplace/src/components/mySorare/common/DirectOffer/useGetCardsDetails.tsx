export const useGetCardsDetails = () => {
  const getCardsDetails = <T extends { assetId: string }>(
    offer: {
      senderSide: {
        nfts: T[];
      };
      receiverSide: {
        nfts: T[];
      };
    } | null,
    isCurrentUserSender: boolean
  ): { sendCards: T[]; receivedCards: T[] } => {
    if (!offer) return { sendCards: [], receivedCards: [] };
    const { senderSide, receiverSide } = offer;
    const sendCards = isCurrentUserSender
      ? senderSide?.nfts
      : receiverSide?.nfts;

    const receivedCards = isCurrentUserSender
      ? receiverSide?.nfts
      : senderSide?.nfts;

    return { sendCards, receivedCards };
  };
  return getCardsDetails;
};
