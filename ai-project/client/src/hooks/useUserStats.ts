import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/services/api';

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const response = await userAPI.getStats();
      return response.data.stats;
    },
    retry: 1,
  });
};