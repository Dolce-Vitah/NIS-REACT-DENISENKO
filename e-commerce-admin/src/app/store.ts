import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api/baseApi';
import authReducer from '@/entities/User/model/authSlice';
import settingsReducer from '@/entities/Settings/model/settingsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  settings: settingsReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'settings'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;