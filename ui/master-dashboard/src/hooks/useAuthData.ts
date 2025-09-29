import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserGroups } from '../store/slices/authSlice';

interface RootState {
  auth: {
    user: {
      id: string;
    } | null;
    isAuthenticated: boolean;
    userGroups: any[] | null;
  };
}

export const useAuthData = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userGroups = useSelector((state: RootState) => state.auth.userGroups);

  useEffect(() => {
    if (isAuthenticated && user?.id && !userGroups) {
      // Fetch user groups when user is authenticated
      dispatch(fetchUserGroups(user.id) as any);
    }
  }, [isAuthenticated, user?.id, userGroups, dispatch]);

  return {
    userGroups,
    isLoading: !userGroups
  };
};
