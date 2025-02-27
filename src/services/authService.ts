import { apiClient } from '@/lib/axios';
import { UserLogin } from '@/types/user';

export const authService = {
  login: async (credentials: UserLogin) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid username or password');
    }
  },
};
