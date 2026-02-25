import { NavLink } from 'react-router-dom';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { type RootState } from '@/app/store';
import { toggleSidebarCollapsed } from '@/entities/Settings/model/settingsSlice';
import {
  IconBox,
  IconChevronLeft,
  IconChevronRight,
  IconLayout,
  IconLogout,
  IconSettings,
  IconUser,
  IconX,
} from '@/shared/ui/icons/AppIcons';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarContent = ({
  onNavigate,
  showTitle = true,
}: {
  onNavigate?: () => void;
  showTitle?: boolean;
}) => {
  const { t } = useAppTranslation();
  const dispatch = useDispatch();
  const collapsed = useSelector((s: RootState) => s.settings.sidebarCollapsed);

  const mkClassName = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? 'ui-nav-link ui-nav-link-active' : 'ui-nav-link'} motion-safe:hover:translate-x-0.5`;

  return (
    <>
      {showTitle && (
        <header className={`mb-4 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-extrabold ui-title truncate whitespace-nowrap overflow-hidden"
              >
                {t('app.title')}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            className="hidden md:inline-flex ui-icon-btn shrink-0"
            onClick={() => dispatch(toggleSidebarCollapsed())}
            aria-label={t('common.toggleSidebar')}
            title={t('common.toggleSidebar')}
            style={!collapsed ? { marginLeft: 'auto' } : undefined}
          >
            {collapsed ? <IconChevronRight aria-hidden="true" /> : <IconChevronLeft aria-hidden="true" />}
          </button>
        </header>
      )}
      <nav className="flex-1" aria-label={t('app.title')}>
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink to="/" className={mkClassName} onClick={onNavigate} aria-label={t('nav.dashboard')} title={t('nav.dashboard')}>
              <IconLayout aria-hidden="true" className="shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {t('nav.dashboard')}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={mkClassName} onClick={onNavigate} aria-label={t('nav.products')} title={t('nav.products')}>
              <IconBox aria-hidden="true" className="shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {t('nav.products')}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={mkClassName} onClick={onNavigate} aria-label={t('nav.profile')} title={t('nav.profile')}>
              <IconUser aria-hidden="true" className="shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {t('nav.profile')}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={mkClassName} onClick={onNavigate} aria-label={t('nav.settings')} title={t('nav.settings')}>
              <IconSettings aria-hidden="true" className="shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {t('nav.settings')}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </li>
        </ul>
      </nav>
      <NavLink
        to="/logout"
        onClick={onNavigate}
        className="mt-auto ui-btn ui-btn-secondary w-full justify-center text-red-600 dark:text-red-400 border-red-200/70 dark:border-red-900/40 hover:bg-red-50/60 dark:hover:bg-red-900/20"
        aria-label={t('nav.logout')}
        title={t('nav.logout')}
      >
        <IconLogout aria-hidden="true" className="shrink-0" />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {t('nav.logout')}
            </motion.span>
          )}
        </AnimatePresence>
      </NavLink>
    </>
  );
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useAppTranslation();
  const collapsed = useSelector((s: RootState) => s.settings.sidebarCollapsed);

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex ui-sidebar h-screen p-4 flex-col overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      <div className="md:hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('common.closeMenu')}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />
        <aside
          className={`fixed z-50 inset-y-0 left-0 w-72 max-w-[85vw] ui-sidebar p-4 flex flex-col transform transition-transform duration-200 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label={t('app.title')}
          aria-hidden={!isOpen}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold ui-title">{t('app.title')}</div>
            <button
              type="button"
              onClick={onClose}
              className="ui-icon-btn"
              aria-label={t('common.closeMenu')}
            >
              <IconX aria-hidden="true" />
            </button>
          </div>
          <SidebarContent onNavigate={onClose} showTitle={false} />
        </aside>
      </div>
    </>
  );
};