import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AboutPage from './page';

vi.mock('../home/_components/home-header', () => ({
  HomeHeader: () => <header>Header da home</header>,
}));

vi.mock('../home/_components/home-footer', () => ({
  HomeFooter: () => <footer>Footer da home</footer>,
}));

describe('AboutPage', () => {
  it('renderiza a rota about completa para acesso direto', () => {
    render(<AboutPage />);

    expect(screen.getByText('Header da home')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sobre o McIntosh Bank' })).toBeInTheDocument();
    expect(screen.getByText('Footer da home')).toBeInTheDocument();
  });
});
