import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutContent } from './about-content';

describe('AboutContent', () => {
  it('renderiza conteudo institucional da pagina sobre', () => {
    render(<AboutContent />);

    expect(screen.getByText('Seu dinheiro em boas patas')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sobre o McIntosh Bank' })).toBeInTheDocument();
    expect(
      screen.getByText('Primeiro Tech Challenge Engenharia Front-end FIAP 2026')
    ).toBeInTheDocument();
    expect(screen.getByText(/O nome McIntosh Bank nasceu de uma homenagem/i)).toBeInTheDocument();
  });

  it('usa layout de modal quando solicitado', () => {
    const { container } = render(<AboutContent variant="modal" />);

    expect(container.querySelector('article')?.className).toContain('min-h-full');
  });
});
