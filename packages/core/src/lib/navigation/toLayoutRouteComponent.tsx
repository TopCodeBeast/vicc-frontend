import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const toLayoutRouteComponent = (Component: FC<any>) => {
  const LayoutRouteComponent = (props: any) => {
    return (
      <Component {...props}>
        <Outlet />
      </Component>
    );
  };
  return LayoutRouteComponent;
};

export default toLayoutRouteComponent;
