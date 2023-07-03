import { useEffect, useRef } from 'react';

function usePortal(id: string) {
  const rootElemRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let parentElem = document.querySelector(`#${id}`);
    if (!parentElem) {
      parentElem = document.createElement('div');
      parentElem.id = id;
      document.body.appendChild(parentElem);
    }
    if (!rootElemRef.current) {
      return undefined;
    }
    parentElem.appendChild(rootElemRef.current);
    return function removeElement() {
      if (rootElemRef.current) {
        rootElemRef.current.remove();
      }
    };
  }, [id]);

  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export default usePortal;
