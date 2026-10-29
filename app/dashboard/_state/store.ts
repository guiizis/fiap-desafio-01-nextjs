import { configureStore } from '@reduxjs/toolkit';
import { accountReducer } from './account.slice';

export function makeStore() {
  return configureStore({
    reducer: {
      account: accountReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
