import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '@/entities/Product/api/productApi';
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation';
import { getErrorTranslationKey } from '@/shared/lib/rtkQuery/getErrorTranslationKey';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(id!);

  if (isLoading) return <div className="ui-muted">{t('common.loading')}...</div>;
  if (error) return <div className="text-red-500">{t(getErrorTranslationKey(error as FetchBaseQueryError | SerializedError))}</div>;
  if (!product) return <div className="ui-muted">{t('products.empty')}</div>;

  return (
    <article className="max-w-4xl ui-card p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 ui-link motion-safe:transition-transform motion-safe:active:scale-[0.99]"
      >
        &larr; {t('common.back')}
      </button>
      
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full md:w-1/2 rounded object-contain h-64"
          style={{ backgroundColor: 'rgb(var(--surface-2))' }}
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold ui-title">{product.title}</h1>
          <span className="ui-badge w-max capitalize">
            {product.category}
          </span>
          <p className="ui-muted text-lg">{product.description}</p>
          <div className="text-2xl font-bold ui-title" style={{ color: 'rgb(var(--primary))' }}>${product.price}</div>
          <div>{t('products.rating')}: {product.rating} ⭐</div>
        </div>
      </div>
    </article>
  );
};

export default ProductDetailsPage;