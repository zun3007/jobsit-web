import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/store';
import {
  authService,
  LoginRequest,
  RegisterRequest,
} from '@/services/authService';
import { queryKeys } from '@/lib/react-query';
import {
  setCredentials,
  logout,
  setLoading,
  setError,
} from '@/features/auth/authSlice';
import { extractErrorMessage } from '@/services/api';

export function useAuth() {
  const dispatch = useAppDispatch();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Get profile query
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('token'),
  });

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    profile,
    isLoading:
      loginMutation.isPending || registerMutation.isPending || isLoadingProfile,
    isLoadingProfile,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
