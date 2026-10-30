import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStoreProvider } from '../dashboard/_state/store-provider';
import { HomeCtaButtons } from './_components/home-cta-buttons';

describe('deduplicação de sessão com RTK Query', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ message: 'Não autenticado.' }), {
            status: 401,
            headers: { 'content-type': 'application/json' },
          })
        )
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('compartilha uma única consulta entre as duas instâncias do hook na home', async () => {
    render(
      <AppStoreProvider>
        <HomeCtaButtons context="header" />
        <HomeCtaButtons context="hero-mobile" />
      </AppStoreProvider>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(screen.getAllByRole('link', { name: /abrir/i })).toHaveLength(2);
  });
});
