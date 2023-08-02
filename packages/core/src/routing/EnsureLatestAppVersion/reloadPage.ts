export const reloadPage = (version: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('t', version);
  window.location.replace(url.href);
  window.location.reload();
};

export default reloadPage;
