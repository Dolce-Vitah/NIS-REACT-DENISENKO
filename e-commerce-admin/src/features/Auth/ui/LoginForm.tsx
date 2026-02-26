import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type SerializedError } from '@reduxjs/toolkit';
import { useLoginMutation } from '@/entities/User/api/authApi';
import { setCredentials } from '@/entities/User/model/authSlice';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { getErrorTranslationKey } from '@/shared/lib/rtkQuery/getErrorTranslationKey';

const loginSchema = z.object({
  username: z.string().min(3, 'auth.validationError'),
  password: z.string().min(3, 'auth.validationError'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { t } = useAppTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [login, { isLoading, error: apiError }] = useLoginMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const apiErrorMessage = apiError ? t(getErrorTranslationKey(apiError)) : null;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const userData = await login(data).unwrap();
      const token = userData.accessToken ?? userData.token;
      if (!token) {
        setError('root', { message: 'auth.tokenMissing' });
        toast.error(t('auth.tokenMissing'));
        return;
      }
      dispatch(setCredentials({ token, user: userData }));
      toast.success(t('auth.loginSuccess', { defaultValue: 'Successfully logged in' }));
      navigate('/'); 
    } catch (err) {
      console.error('Login failed', err);
      toast.error(t(getErrorTranslationKey(err as FetchBaseQueryError | SerializedError)));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="ui-card flex flex-col gap-4 p-6 w-[380px] max-w-[92vw] motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
      aria-describedby={apiErrorMessage || errors.root?.message ? 'login-error' : undefined}
    >
      <h2 className="text-2xl font-bold mb-2 ui-title">{t('auth.loginTitle')}</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-username" className="text-sm font-medium ui-muted">
          {t('auth.username')}
        </label>
        <input
          id="login-username"
          type="text"
          autoComplete="username"
          placeholder={t('auth.username')}
          {...register('username')}
          className="ui-input"
          aria-invalid={Boolean(errors.username)}
        />
        {errors.username && (
          <span className="text-red-500 text-xs mt-1">{t(errors.username.message as string)}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-sm font-medium ui-muted">
          {t('auth.password')}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder={t('auth.password')}
          {...register('password')}
          className="ui-input"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1">{t(errors.password.message as string)}</span>
        )}
      </div>

      {(apiErrorMessage || errors.root?.message) && (
        <p id="login-error" className="text-red-600 text-sm" role="alert" aria-live="polite">
          {apiErrorMessage || t(errors.root?.message as string)}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="ui-btn ui-btn-primary w-full motion-safe:active:scale-[0.99]"
      >
        {isLoading ? t('auth.loading') : t('auth.submit')}
      </button>
    </form>
  );
};