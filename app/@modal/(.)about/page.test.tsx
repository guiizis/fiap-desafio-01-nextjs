import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AboutModalPage from './page';

vi.mock('../_components/modal-shell', () => ({
  ModalShell: ({
    children,
    closeLabel,
    dialogLabel,
  }: {
    children: ReactNode;
    closeLabel: string;
    dialogLabel: string;
  }) => (
    <section aria-label={dialogLabel} data-close-label={closeLabel}>
      {children}
    </section>
  ),
}));

describe('AboutModalPage', () => {
  it('renderiza conteudo de about no modal interceptado', () => {
    render(<AboutModalPage />);

    expect(screen.getByLabelText('Sobre o Mcintosh Bank')).toHaveAttribute(
      'data-close-label',
      'Fechar sobre'
    );
    expect(screen.getByRole('heading', { name: 'Sobre o McIntosh Bank' })).toBeInTheDocument();
  });
});
