import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatementPanel } from './statement-panel';
import { StatementEntryType, TransactionType } from './interfaces/statement-panel.interfaces';

function triggerButtonClickHandler(element: HTMLElement) {
  const reactPropsKey = Object.keys(element).find((key) => key.startsWith('__reactProps$'));
  if (!reactPropsKey) {
    throw new Error('Props internas do React nao encontradas');
  }

  const reactProps = (element as Record<string, unknown>)[reactPropsKey] as {
    onClick?: () => void;
  };
  reactProps.onClick?.();
}

function getEntryByDate(date: string) {
  const entry = screen.getByText(date).closest('li');
  if (!entry) {
    throw new Error(`Lancamento nao encontrado para data ${date}`);
  }

  return entry;
}

describe('StatementPanel', () => {
  it('renderiza titulo e lancamentos do extrato e habilita acoes ao selecionar item', () => {
    render(
      <StatementPanel
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
          {
            id: '2',
            month: 'Novembro',
            type: StatementEntryType.TRANSFER,
            amountInCents: -50000,
            date: '21/11/2022',
          },
        ]}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Editar extrato' });
    const deleteButton = screen.getByRole('button', { name: 'Excluir extrato' });

    expect(screen.getByRole('heading', { name: 'Extrato', level: 2 })).toBeInTheDocument();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(screen.getAllByText('Novembro')).toHaveLength(2);
    expect(screen.getByText(/Dep/i)).toBeInTheDocument();
    expect(screen.getByText(/Transfer/i)).toBeInTheDocument();

    fireEvent.click(getEntryByDate('18/11/2022'));
    expect(editButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();
  });

  it('oculta botoes quando showActions e falso', () => {
    render(
      <StatementPanel
        showActions={false}
        entries={[
          {
            id: '1',
            month: 'Abril',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 1000,
            date: '21/04/2026',
          },
        ]}
      />
    );

    expect(screen.getByText(/Dep/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar extrato' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Excluir extrato' })).not.toBeInTheDocument();
  });

  it('abre modal de edicao e envia payload completo de tipo, valor e data', () => {
    const onEditEntry = vi.fn(() => ({ ok: true as const }));

    render(
      <StatementPanel
        onEditEntry={onEditEntry}
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    fireEvent.click(getEntryByDate('18/11/2022'));
    fireEvent.click(screen.getByRole('button', { name: 'Editar extrato' }));

    expect(screen.getByRole('heading', { name: /Editar trans/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Tipo de trans/i })).toHaveValue(
      TransactionType.DEPOSIT
    );
    expect(screen.getByRole('textbox', { name: 'Valor' })).toHaveValue('150,00');

    fireEvent.change(screen.getByRole('combobox', { name: /Tipo de trans/i }), {
      target: { value: TransactionType.TRANSFER },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Valor' }), {
      target: { value: '70000' },
    });
    fireEvent.change(screen.getByLabelText('Data'), {
      target: { value: '2026-04-22' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Salvar edi/i }));

    expect(onEditEntry).toHaveBeenCalledWith({
      entryId: '1',
      type: TransactionType.TRANSFER,
      amountInCents: 70000,
      transactionDate: '2026-04-22',
    });
    expect(screen.queryByRole('heading', { name: /Editar trans/i })).not.toBeInTheDocument();
  });

  it('mantem modal aberto e mostra alerta quando a edicao retorna erro', () => {
    const onEditEntry = vi.fn(() => ({
      ok: false as const,
      message: 'Saldo insuficiente para concluir a transferencia.',
    }));

    render(
      <StatementPanel
        onEditEntry={onEditEntry}
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    fireEvent.click(getEntryByDate('18/11/2022'));
    fireEvent.click(screen.getByRole('button', { name: 'Editar extrato' }));
    fireEvent.change(screen.getByLabelText('Data'), {
      target: { value: '2026-04-21' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Salvar edi/i }));

    expect(onEditEntry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveTextContent('Saldo insuficiente');
    expect(screen.getByRole('heading', { name: /Editar trans/i })).toBeInTheDocument();
  });

  it('deseleciona lancamento ao clicar fora do painel e bloqueia botoes novamente', () => {
    render(
      <StatementPanel
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Editar extrato' });
    const deleteButton = screen.getByRole('button', { name: 'Excluir extrato' });

    fireEvent.click(getEntryByDate('18/11/2022'));
    expect(editButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();

    fireEvent.mouseDown(document.body);
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('ignora evento global quando target nao eh um Node', () => {
    render(
      <StatementPanel
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', {
      value: { arbitrary: true },
      configurable: true,
    });

    document.dispatchEvent(event);

    expect(screen.getByRole('button', { name: 'Editar extrato' })).toBeDisabled();
  });

  it('mantem selecao quando o clique acontece dentro do painel', () => {
    render(
      <StatementPanel
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Editar extrato' });

    fireEvent.click(getEntryByDate('18/11/2022'));
    expect(editButton).toBeEnabled();

    fireEvent.mouseDown(screen.getByLabelText('Extrato da conta'));
    expect(editButton).toBeEnabled();
  });

  it('cobre guards de edit e delete quando nao ha item selecionado', () => {
    const onDeleteEntry = vi.fn();
    const onEditEntry = vi.fn();

    render(
      <StatementPanel
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Editar extrato' });
    const deleteButton = screen.getByRole('button', { name: 'Excluir extrato' });

    triggerButtonClickHandler(editButton);
    triggerButtonClickHandler(deleteButton);

    expect(onEditEntry).not.toHaveBeenCalled();
    expect(onDeleteEntry).not.toHaveBeenCalled();
  });

  it('fecha modal com Escape e exclui item selecionado', () => {
    const onDeleteEntry = vi.fn();

    render(
      <StatementPanel
        onDeleteEntry={onDeleteEntry}
        entries={[
          {
            id: '1',
            month: 'Novembro',
            type: StatementEntryType.DEPOSIT,
            amountInCents: 15000,
            date: '18/11/2022',
          },
        ]}
      />
    );

    fireEvent.click(getEntryByDate('18/11/2022'));
    fireEvent.click(screen.getByRole('button', { name: 'Editar extrato' }));
    expect(screen.getByRole('heading', { name: /Editar trans/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('heading', { name: /Editar trans/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir extrato' }));
    expect(onDeleteEntry).toHaveBeenCalledWith('1');
  });
});
