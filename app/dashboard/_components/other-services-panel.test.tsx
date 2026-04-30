import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OtherServicesPanel } from './other-services-panel';

describe('OtherServicesPanel', () => {
  it('renderiza o grid de serviços disponíveis', () => {
    render(<OtherServicesPanel />);

    expect(
      screen.getByRole('heading', { name: /confira os servi[c\u00e7]os dispon[i\u00ed]veis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /abrir aviso do servi[c\u00e7]o empr/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /abrir aviso do servi[c\u00e7]o meus cart/i })
    ).toBeInTheDocument();
  });

  it('abre e fecha o modal de serviço em construção', () => {
    render(<OtherServicesPanel />);

    const [openWarningButton] = screen.getAllByRole('button', {
      name: /abrir aviso do servi[c\u00e7]o/i,
    });

    fireEvent.click(openWarningButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/ainda em constru/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /voltar para o painel/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
