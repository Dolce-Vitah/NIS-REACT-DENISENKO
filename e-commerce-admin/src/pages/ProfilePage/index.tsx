import { NavLink } from 'react-router-dom';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { useGetMeQuery } from '@/entities/User/api/authApi';
import { getErrorTranslationKey } from '@/shared/lib/rtkQuery/getErrorTranslationKey';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

const ProfilePage = () => {
  const { t } = useAppTranslation();
  const { data: user, isLoading, error } = useGetMeQuery(undefined);

  if (isLoading) return <div className="ui-muted">{t('common.loading')}...</div>;
  if (error) return <div className="text-red-500">{t(getErrorTranslationKey(error as FetchBaseQueryError | SerializedError))}</div>;

  return (
    <section className="max-w-lg ui-card p-6" aria-label={t('nav.profile')}>
      <h1 className="text-2xl font-bold mb-6 ui-title">{t('nav.profile')}</h1>
      
      <div className="flex items-center gap-6">
        <img 
          src={user?.image || 'https://via.placeholder.com/150'} 
          alt={t('profile.avatarAlt')}
          className="w-24 h-24 rounded-full border shadow-sm"
          style={{ borderColor: 'rgb(var(--border))' }}
        />
        <div className="flex flex-col gap-2">
          <div className="text-xl font-medium">{user?.firstName} {user?.lastName}</div>
          <div className="ui-muted">@{user?.username}</div>
          <div className="ui-muted">{user?.email}</div>
        </div>
      </div>

      <div className="mt-6">
        <NavLink
          to="/logout"
          className="ui-btn ui-btn-secondary inline-flex text-red-600 dark:text-red-400 border-red-200/70 dark:border-red-900/40 hover:bg-red-50/60 dark:hover:bg-red-900/20"
        >
          {t('nav.logout')}
        </NavLink>
      </div>
    </section>
  );
};

export default ProfilePage;