import { useEffect, useState } from 'react';

import { load } from '@sorare/core/src/lib/http';

function useFetch<T extends NonNullable<unknown> = string>(url: string) {
  const [data, setData] = useState<null | T>(null);

  useEffect(() => {
    const fetchData = async () => {
      setData(await load<T>(url));
    };

    fetchData();
  }, [url]);

  return data;
}

export default useFetch;
