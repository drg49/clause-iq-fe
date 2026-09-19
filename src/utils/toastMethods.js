import { toast } from 'react-toastify';
import { css } from 'glamor';

const theme = {
  success: '#1ab394',
  error: '#ed5565',
  warning: '#f8ac59',
};

const defaultOptions = {
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const notify = (message, type, position, canDuplicate) => {
  const toastOptions = {
    ...defaultOptions,
    position,
    toastId: canDuplicate ? undefined : `${type}-toast`,
    className: css({ background: theme[type] }),
  };

  toast[type](message, toastOptions);
};

export const notifySuccess = (
  message,
  position = 'top-right',
  canDuplicate = true,
) => notify(message, 'success', position, canDuplicate);

export const notifyError = (
  message,
  position = 'top-right',
  canDuplicate = true,
) => notify(message, 'error', position, canDuplicate);

export const notifyWarn = (
  message,
  position = 'top-right',
  canDuplicate = true,
) => notify(message, 'warning', position, canDuplicate);
