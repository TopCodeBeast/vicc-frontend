export function catchAll(path: string) {
  return `${path.replace(/\/$/, '')}/*`;
}

export function relative(path: string, childrenPath: string) {
  return childrenPath.replace(path, '').replace(/^\//, '');
}

export function hasPreviousLocation(delta?: number) {
  const backDelta = delta || -1;
  return window.history.state?.idx > Math.abs(backDelta) - 1;
}
