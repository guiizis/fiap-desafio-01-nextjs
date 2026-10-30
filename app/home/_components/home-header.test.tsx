import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomeHeader } from './home-header';

vi.mock('@/app/dashboard/_hooks/use-auth-session', () => ({
  useAuthSession: () => ({ session: null, status: 'unauthenticated' }),
}));

describe('HomeHeader', () => {
  it('renderiza estruturas de desktop, tablet e mobile do header', async () => {
    render(<HomeHeader />);

    expect(screen.getByAltText('McIntosh Bank')).toBeInTheDocument();
    expect(screen.getByAltText('McIntosh Bank símbolo tablet')).toBeInTheDocument();
    expect(screen.getByAltText('McIntosh Bank mobile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir menu de navegação/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sobre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Servi/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Abrir minha conta/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tenho conta/i })).toBeInTheDocument();
  });
});
