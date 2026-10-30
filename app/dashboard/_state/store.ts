import { configureStore } from '@reduxjs/toolkit';
import { bankApi } from './bank-api';

export function makeStore() {
  return configureStore({
    reducer: {
      [bankApi.reducerPath]: bankApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(bankApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
