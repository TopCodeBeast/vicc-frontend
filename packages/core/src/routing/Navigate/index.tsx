import {
  Navigate as BaseNavigate,
  NavigateProps as BaseNavigateProps,
  useSearchParams,
} from 'react-router-dom';

export type NavigateProps = BaseNavigateProps & {
  keepParams?: boolean;
};
export const Navigate = ({ keepParams, to, ...otherProps }: NavigateProps) => {
  const [searchParams] = useSearchParams();
  return (
    <BaseNavigate
      {...otherProps}
      to={`${to}${keepParams ? `?${searchParams.toString()}` : ''}`}
    />
  );
};
