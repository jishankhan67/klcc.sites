import { useToast as useReactHotToast } from 'react-hot-toast';

export const useToast = () => {
  const toast = useReactHotToast();

  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
  };
};