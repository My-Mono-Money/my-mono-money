import { toast } from 'react-toastify';

export function notify(text: string, icon: string) {
  return toast.info(text, {
    position: 'top-center',
    icon: icon,
    delay: 500,
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
}
