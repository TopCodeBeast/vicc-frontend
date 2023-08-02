import { MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

const BulletPointList = styled.ul`
  padding-inline-start: 20px;
`;
const BulletPoint = styled.li`
  list-style-type: disc;
`;

type Props = {
  bulletPoints: MessageDescriptor[];
};
const BulletPoints = ({ bulletPoints }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <BulletPointList>
      {bulletPoints.map(message => (
        <BulletPoint key={message.id}>{formatMessage(message)}</BulletPoint>
      ))}
    </BulletPointList>
  );
};

export default BulletPoints;
