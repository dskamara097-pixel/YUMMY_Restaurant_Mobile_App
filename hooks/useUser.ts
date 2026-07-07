import { useAuth } from '@/hooks/useAuth';

export function useUser() {
  const auth = useAuth();

  return {
    user: null,
    userId: auth.userId,
    role: auth.role,
    isLoading: false,
  };
}
