import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AboutModalPage from './page';

vi.mock('../_components/modal-shell', () => ({
  ModalShell: ({ children, closeLabel }: { children: ReactNode; closeLabel: string }) => (
    <section aria-label={closeLabel}>{children}</section>
  ),
}));

describe('AboutModalPage', () => {
  it('renderiza conteudo de about no modal interceptado', () => {
    render(<AboutModalPage />);

    expect(screen.getByLabelText('Fechar sobre')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sobre o McIntosh Bank' })).toBeInTheDocument();
  });
});
