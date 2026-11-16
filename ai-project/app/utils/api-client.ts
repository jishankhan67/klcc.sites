import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch user account
export const useUserAccount = () => {
  return useQuery({
    queryKey: ['user-account'],
    queryFn: async () => {
      const { data } = await axios.get('/api/user-accounts');
      return data;
    },
  });
};

// Execute Daily Spin Mutation
export const useDailySpin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/spin/execute');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account'] });
    },
  });
};

// Initialize Malaysia Payment Gateway Deposit
export const useMalaysiaDeposit = () => {
  return useMutation({
    mutationFn: async ({ amount, gateway }: { amount: number; gateway: string }) => {
      const { data } = await axios.post('/api/user-accounts/manual-deposit', { amount, gateway });
      return data; // returns paymentUrl
    },
  });
};

// Invest in Plan
export const useInvestPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ planId }: { planId: number }) => {
      const { data } = await axios.post('/api/user-accounts/invest', { planId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account'] });
    },
  });
};

// Process Daily Task
export const useDailyTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      const { data } = await axios.post('/api/user-accounts/daily-task', { taskId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account'] });
    },
  });
};

// Get User Earnings
export const useGetEarnings = () => {
  return useQuery({
    queryKey: ['user-earnings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/user-accounts/earnings');
      return data;
    },
  });
};

// Register Bonus
export const useRegisterBonus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bonusCode }: { bonusCode: string }) => {
      const { data } = await axios.post('/api/user-accounts/register-bonus', { bonusCode });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-account'] });
    },
  });
};