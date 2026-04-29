import { describe, expect, it, vi } from 'vitest';
import DashboardPage from './page';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('DashboardPage', () => {
  it('redireciona para a rota inicial do dashboard', () => {
    DashboardPage();

    expect(redirectMock).toHaveBeenCalledWith('/dashboard/home');
  });
});
