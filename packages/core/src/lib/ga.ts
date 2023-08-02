export const getClientId = () => {
  let gaClientId: string | undefined;
  if (window.ga) {
    window.ga((tracker: any) => {
      gaClientId = tracker?.get('clientId');
    });
  }

  return gaClientId;
};
