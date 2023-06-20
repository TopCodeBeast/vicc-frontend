import { useNavigate } from 'react-router-dom';

import BlueShirt from '@sorare/core/src/atoms/icons/shirts/BlueShirt';
import RedShirt from '@sorare/core/src/atoms/icons/shirts/RedShirt';
import YellowShirt from '@sorare/core/src/atoms/icons/shirts/YellowShirt';

// We don't use MaterialUI, react-intl or any other imports to reduce the chances of failing
import './styles.css';

export enum ErrorLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export const levelOfErrorCode = (code: number | string) => {
  if (Number(code) >= 500) return ErrorLevel.ERROR;
  if (Number(code) >= 400) return ErrorLevel.WARNING;
  return ErrorLevel.INFO;
};

export const images = {
  error: <RedShirt />,
  warning: <YellowShirt />,
  info: <BlueShirt />,
};

export interface ErrorProps {
  message: string;
  code: number | string;
}

const buildClass = (type: string): string => `HandledError-${type}`;

export const HandledError = ({ code, message }: ErrorProps) => {
  const level = levelOfErrorCode(code);
  const navigate = useNavigate();

  const handleNavigate = () => navigate(-1);

  return (
    <div className={buildClass('root')}>
      <meta httpEquiv="refresh" content="60" />
      <div className={buildClass('container')}>
        <div className={buildClass('image-container')}>
          <div
            className={`${buildClass('error-container-text')} ${buildClass(
              level
            )}`}
          />
          {images[level]}
        </div>
        <div className={`${buildClass('block')} ${buildClass('blockPadded')}`}>
          <h3>{message}</h3>
          <button
            onClick={handleNavigate}
            type="button"
            className={buildClass('button')}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandledError;
