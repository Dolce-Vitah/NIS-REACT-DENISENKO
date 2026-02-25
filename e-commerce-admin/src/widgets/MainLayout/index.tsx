import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../Sidebar/ui/Sidebar';
import { LangSwitcher } from '@/features/Settings/ui/LangSwitcher';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { ThemeToggle } from '@/features/Settings/ui/ThemeToggle';
import { IconMenu } from '@/shared/ui/icons/AppIcons';

const MainLayout = () => {
  const { t } = useAppTranslation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastLocationKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const currentKey = location.key ?? `${location.pathname}?${location.search}`;
    const prevKey = lastLocationKeyRef.current;
    lastLocationKeyRef.current = currentKey;

    if (prevKey && prevKey !== currentKey && isSidebarOpen) {
      const id = window.setTimeout(() => setIsSidebarOpen(false), 0);
      return () => window.clearTimeout(id);
    }
  }, [isSidebarOpen, location.key, location.pathname, location.search]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 ui-grid" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 ui-card px-4 py-2"
        style={{ color: 'rgb(var(--primary))' }}
      >
        {t('common.skipToContent')}
      </a>

      <div className="relative z-10 flex h-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <header className="sticky top-0 z-20 h-16 ui-topbar flex items-center justify-between px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden ui-icon-btn"
              aria-label={t('common.openMenu')}
            >
              <IconMenu aria-hidden="true" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LangSwitcher />
            </div>
          </header>
          <main id="main-content" className="p-4 sm:p-6 flex-1 overflow-auto min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;