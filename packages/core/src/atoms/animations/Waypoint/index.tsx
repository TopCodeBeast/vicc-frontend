import { Waypoint } from 'react-waypoint';

const WaypointComponent = (props: Waypoint.WaypointProps) => {
  const { children, ...rest } = props;
  return <Waypoint {...rest}>{children}</Waypoint>;
};

export default WaypointComponent;
