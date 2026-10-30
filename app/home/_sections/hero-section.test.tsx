import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeroSection } from './hero-section';

vi.mock('@/app/dashboard/_hooks/use-auth-session', () => ({
  useAuthSession: () => ({ session: null, status: 'unauthenticated' }),
}));

describe('HeroSection', () => {
  it('renderiza titulo principal e ilustracao', async () => {
    render(<HeroSection />);

    expect(
      screen.getByRole('heading', {
        name: /Experimente mais liberdade no controle da sua vida financeira/i,
        level: 1,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Ilustracao de crescimento financeiro' })
    ).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Abrir conta' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tenho conta/i })).toBeInTheDocument();
  });
});
