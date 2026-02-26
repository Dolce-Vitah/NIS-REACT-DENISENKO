import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGetProductsQuery, useSearchProductsQuery, useDeleteProductMutation } from '@/entities/Product/api/productApi';
import { type RootState } from '@/app/store';
import useDebounce from '@/shared/hooks/useDebounce'; 
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { getErrorTranslationKey } from '@/shared/lib/rtkQuery/getErrorTranslationKey';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { IconSearchX, IconTrash } from '@/shared/ui/icons/AppIcons';

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const ProductsPage = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const initialQuery = searchParams.get('q') ?? '';
  const initialPageRaw = Number(searchParams.get('page') ?? '1');
  const initialPage = Number.isFinite(initialPageRaw) && initialPageRaw > 0 ? initialPageRaw : 1;

  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [pendingDelete, setPendingDelete] = useState<{ id: number; title: string } | null>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  const limit = useSelector((state: RootState) => state.settings?.itemsPerPage || 10);
  const skip = (page - 1) * limit;

  const isSearching = debouncedSearch.length > 0;
  
  const { data: allData, isLoading: isAllLoading, error: allError } = useGetProductsQuery(
    { limit, skip }, 
    { skip: isSearching }
  );
  
  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useSearchProductsQuery(
    { q: debouncedSearch, limit, skip }, 
    { skip: !isSearching }
  );

  const [deleteProduct] = useDeleteProductMutation();

  const data = isSearching ? searchData : allData;
  const isLoading = isAllLoading || isSearchLoading;
  const requestError = isSearching ? searchError : allError;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return;
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (isTypingTarget) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const product = data?.products?.find((item) => item.id === id);
    if (!product) return;
    setPendingDelete({ id, title: product.title });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProduct({ id: pendingDelete.id, limit, skip, q: isSearching ? debouncedSearch : undefined }).unwrap();
      toast.success(t('products.deleteSuccess', { defaultValue: 'Product deleted successfully' }));
    } catch (err) {
      console.error('Failed to delete product', err);
      toast.error(t('products.deleteError', { defaultValue: 'Failed to delete product' }));
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <section className="flex flex-col gap-4" aria-label={t('products.title')}>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ui-title">{t('products.title')}</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="products-search" className="sr-only">
            {t('products.search')}
          </label>
          <input
            ref={searchInputRef}
            id="products-search"
            type="search"
            placeholder={t('products.search')}
            value={searchTerm}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchTerm(nextValue);
              setPage(1);
              const next = new URLSearchParams(searchParams);
              if (nextValue.trim()) {
                next.set('q', nextValue.trim());
              } else {
                next.delete('q');
              }
              next.set('page', '1');
              setSearchParams(next, { replace: true });
            }}
            className="ui-input w-64 max-w-[55vw]"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="ui-card p-4">
          <div className="skeleton h-8 w-56 mb-4" />
          <div className="flex flex-col gap-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="skeleton h-10 w-10 rounded shrink-0" />
                <div className="skeleton h-6 w-1/3" />
                <div className="skeleton h-6 w-1/4" />
                <div className="skeleton h-6 w-16" />
                <div className="skeleton h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="sr-only">{t('common.loading')}...</div>
        </div>
      ) : requestError ? (
        <div className="text-red-500">{t(getErrorTranslationKey(requestError))}</div>
      ) : (
        <div className="ui-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="ui-table w-full text-left min-w-[720px]">
            <caption className="sr-only">{t('products.title')}</caption>
            <thead className="text-sm ui-muted">
              <tr>
                <th scope="col" className="p-3">{t('products.id')}</th>
                <th scope="col" className="p-3">{t('products.name')}</th>
                <th scope="col" className="p-3">{t('products.category')}</th>
                <th scope="col" className="p-3">{t('products.price')}</th>
                <th scope="col" className="p-3">{t('products.rating')}</th>
                <th scope="col" className="p-3 text-right">{t('common.actions', { defaultValue: 'Actions' })}</th>
              </tr>
            </thead>
            <motion.tbody
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              <AnimatePresence>
                {data?.products?.length === 0 && (
                  <motion.tr exit={{ opacity: 0 }}>
                    <td colSpan={6}>
                      <EmptyState
                        icon={<IconSearchX size={32} />}
                        title={t('products.empty')}
                        description={t('products.emptyDescription', { defaultValue: 'No products found matching your search criteria.' })}
                      />
                    </td>
                  </motion.tr>
                )}
                {data?.products?.map((product) => (
                  <motion.tr 
                    key={product.id} 
                    variants={tableRowVariants}
                    exit="exit"
                    layout
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="cursor-pointer transition-colors motion-safe:hover:bg-[rgb(var(--hover-strong))]"
                  >
                    <td className="p-3 ui-muted">{product.id}</td>
                    <td className="p-3 font-medium flex items-center gap-3">
                      <img src={product.thumbnail} alt={product.title} className="w-10 h-10 rounded object-cover" />
                      {product.title}
                    </td>
                    <td className="p-3 capitalize">{product.category}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3">{product.rating} ⭐</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, product.id)}
                        className="ui-icon-btn text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800"
                        aria-label={t('common.delete', { defaultValue: 'Delete' })}
                        title={t('common.delete', { defaultValue: 'Delete' })}
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
          </div>
        </div>
      )}

      <nav className="flex gap-2 justify-end items-center" aria-label={t('products.title')}>
        <button
          disabled={page === 1}
          onClick={() => {
            const nextPage = Math.max(1, page - 1);
            setPage(nextPage);
            const next = new URLSearchParams(searchParams);
            next.set('page', String(nextPage));
            setSearchParams(next, { replace: true });
          }}
          className="ui-btn ui-btn-secondary disabled:opacity-50"
        >
          {t('common.prev')}
        </button>
        <span className="ui-muted text-sm">
          {page} / {Math.max(1, Math.ceil((data?.total || 0) / limit))}
        </span>
        <button
          disabled={data ? skip + limit >= data.total : true}
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            const next = new URLSearchParams(searchParams);
            next.set('page', String(nextPage));
            setSearchParams(next, { replace: true });
          }}
          className="ui-btn ui-btn-secondary disabled:opacity-50"
        >
          {t('common.next')}
        </button>
      </nav>

      <AnimatePresence>
        {pendingDelete && (
          <>
            <motion.div
              className="ui-modal-overlay z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingDelete(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <div className="ui-modal w-full max-w-md p-5">
                <h2 className="text-lg font-semibold ui-title mb-2">
                  {t('products.deleteConfirmTitle', { defaultValue: 'Delete this product?' })}
                </h2>
                <p className="ui-muted text-sm mb-5">
                  {t('products.deleteConfirmDescription', {
                    defaultValue: 'The product "{{title}}" will be permanently removed.',
                    title: pendingDelete.title,
                  })}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="ui-btn ui-btn-secondary"
                    onClick={() => setPendingDelete(null)}
                  >
                    {t('common.cancel', { defaultValue: 'Cancel' })}
                  </button>
                  <button
                    type="button"
                    className="ui-btn ui-btn-primary"
                    onClick={confirmDelete}
                  >
                    {t('common.delete', { defaultValue: 'Delete' })}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductsPage;