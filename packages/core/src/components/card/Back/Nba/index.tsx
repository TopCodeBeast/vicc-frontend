import { Sport } from '@core/__generated__/globalTypes';
import {
  USSportCardBack,
  Props as USSportCardBackProps,
} from '@core/components/cards/Back';

type Props = Omit<USSportCardBackProps, 'sport'>;

export const CardBack = ({ ...props }: Props) => {
  return <USSportCardBack sport={Sport.NBA} {...props} />;
};
