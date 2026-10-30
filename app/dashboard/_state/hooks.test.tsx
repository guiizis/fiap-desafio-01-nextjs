import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppStoreProvider } from './store-provider';
import { useAppDispatch, useAppSelector, useAppStore } from './hooks';

describe('hooks tipados da store', () => {
  it('expõem dispatch, estado e a instância da store', () => {
    const { result } = renderHook(
      () => ({
        dispatch: useAppDispatch(),
        apiState: useAppSelector((state) => state.bankApi),
        store: useAppStore(),
      }),
      { wrapper: AppStoreProvider }
    );

    expect(result.current.dispatch).toBe(result.current.store.dispatch);
    expect(result.current.apiState).toBe(result.current.store.getState().bankApi);
  });
});
