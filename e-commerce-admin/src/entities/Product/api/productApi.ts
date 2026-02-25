import { baseApi } from '@/shared/api/baseApi';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, { limit: number; skip: number }>({
      query: ({ limit, skip }) => `/products?limit=${limit}&skip=${skip}`,
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
    searchProducts: builder.query<ProductsResponse, { q: string; limit: number; skip: number }>({
      query: ({ q, limit, skip }) => `/products/search?q=${q}&limit=${limit}&skip=${skip}`,
    }),
    deleteProduct: builder.mutation<Product, { id: number; limit: number; skip: number; q?: string }>({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id, limit, skip, q }, { dispatch, queryFulfilled }) {
        const patchResultGet = dispatch(
          productApi.util.updateQueryData('getProducts', { limit, skip }, (draft) => {
            const index = draft.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              draft.products.splice(index, 1);
            }
          })
        );

        const patchResultSearch = dispatch(
          productApi.util.updateQueryData('searchProducts', { q: q || '', limit, skip }, (draft) => {
            const index = draft.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              draft.products.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResultGet.undo();
          patchResultSearch.undo();
        }
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useSearchProductsQuery, useDeleteProductMutation } = productApi;