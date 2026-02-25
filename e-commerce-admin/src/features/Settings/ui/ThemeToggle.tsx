import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleTheme } from '@/entities/Settings/model/settingsSlice';
import { type RootState } from '@/app/store';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { IconMoon, IconSun } from '@/shared/ui/icons/AppIcons';

export const ThemeToggle = () => {
  const { t } = useAppTranslation();
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.settings.theme);

  return (
    <button
      type="button"
      className="ui-icon-btn relative overflow-hidden"
      aria-label={t('common.toggleTheme')}
      onClick={() => dispatch(toggleTheme())}
      title={t('common.toggleTheme')}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: 20, opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === 'light' ? <IconMoon aria-hidden="true" /> : <IconSun aria-hidden="true" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};


