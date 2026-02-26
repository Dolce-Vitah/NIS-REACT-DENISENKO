import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/entities/User/api/authApi';
import { logout, setUser } from '@/entities/User/model/authSlice';
import { type RootState } from '@/app/store';
import { baseApi } from '@/shared/api/baseApi';

export function useInitAuth() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const query = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    }
  }, [dispatch, query.data]);

  useEffect(() => {
    if (token && query.isError) {
      dispatch(baseApi.util.resetApiState());
      dispatch(logout());
    }
  }, [dispatch, query.isError, token]);

  return { isInitializing: Boolean(token) && query.isFetching };
}

