import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';

type Props = {
  deprecatedTabSlugs: string[];
  pageSlug?: string;
  pagePath: string;
};
const useHandleBackwardCompatibility = ({
  deprecatedTabSlugs,
  pageSlug,
  pagePath,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const deprecatedTabParam = searchParams.get('tab');
  useEffect(() => {
    if (deprecatedTabParam && deprecatedTabSlugs.includes(deprecatedTabParam)) {
      const params = pageSlug ? { slug: pageSlug } : {};
      searchParams.delete('tab');
      navigate(
        {
          pathname: `${generatePath(pagePath, params)}/${deprecatedTabParam}`,
          search: searchParams.toString(),
        },
        {
          replace: true,
        }
      );
      searchParams.delete('tab');
    }
    setLoading(false);
  }, [
    deprecatedTabParam,
    deprecatedTabSlugs,
    navigate,
    pagePath,
    searchParams,
    pageSlug,
  ]);
  return { loading };
};

export default useHandleBackwardCompatibility;
