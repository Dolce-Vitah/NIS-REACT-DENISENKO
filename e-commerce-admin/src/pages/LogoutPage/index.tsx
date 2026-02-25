import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { logout } from '@/entities/User/model/authSlice';
import { baseApi } from '@/shared/api/baseApi';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';

const LogoutPage = () => {
  const { t } = useAppTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(baseApi.util.resetApiState());
    dispatch(logout());
    toast.success(t('auth.logoutSuccess', { defaultValue: 'Successfully logged out' }));
    navigate('/login', { replace: true });
  }, [dispatch, navigate, t]);

  return <div className="p-6 ui-muted">{t('auth.loggingOut')}</div>;
};

export default LogoutPage;

