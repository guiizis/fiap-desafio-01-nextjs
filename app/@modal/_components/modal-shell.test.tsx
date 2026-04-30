import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalShell } from './modal-shell';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('ModalShell', () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  it('renderiza container de dialogo com conteudo', () => {
    render(
      <ModalShell>
        <div>Conteudo do modal</div>
      </ModalShell>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Conteudo do modal')).toBeInTheDocument();
  });

  it("fecha modal chamando redirect('/home')", () => {
    render(
      <ModalShell>
        <div>Conteudo</div>
      </ModalShell>
    );

    fireEvent.click(screen.getByRole('button', { name: /fechar cadastro/i }));
    expect(redirectMock).toHaveBeenCalledWith('/home');
  });

  it('fecha modal ao clicar no backdrop', () => {
    render(
      <ModalShell>
        <div>Conteudo do modal</div>
      </ModalShell>
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(redirectMock).toHaveBeenCalledWith('/home');
  });

  it('nao fecha modal ao clicar dentro do conteudo', () => {
    render(
      <ModalShell>
        <div>Conteudo interno</div>
      </ModalShell>
    );

    fireEvent.click(screen.getByText('Conteudo interno'));
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
