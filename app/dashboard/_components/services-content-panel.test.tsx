import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardContentPanel } from './dashboard-content-panel';

describe('DashboardContentPanel', () => {
  it('renderiza conteudo correspondente da aba ativa', () => {
    render(<DashboardContentPanel activeTab="meus-cartoes" />);

    expect(
      screen.getByText('Gerencie seus cartoes fisico e digital com rapidez.')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Emprestimo')).toBeInTheDocument();
    expect(screen.getByLabelText('Meus cartoes')).toBeInTheDocument();
  });
});
