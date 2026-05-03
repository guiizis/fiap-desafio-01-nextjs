import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyCardsSection } from './dashboard-content-panel';
import { vi } from 'vitest';

describe('MyCardsSection', () => {
  it('renderiza os dois cartões', () => {
    render(<MyCardsSection onBack={() => {}} />);

    expect(screen.getByText(/cartão físico/i)).toBeInTheDocument();
    expect(screen.getByText(/cartão digital/i)).toBeInTheDocument();
  });

  it('chama onBack ao clicar em voltar', () => {
    const onBack = vi.fn();
    render(<MyCardsSection onBack={onBack} />);

    fireEvent.click(screen.getByText(/voltar/i));
    expect(onBack).toHaveBeenCalled();
  });

  it('alterna bloqueio do cartão físico', () => {
    render(<MyCardsSection onBack={() => {}} />);

    const btn = screen.getAllByRole('button', { name: /bloquear/i })[0];

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/desbloquear/i);

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/bloquear/i);
  });

  it('alterna bloqueio do cartão digital', () => {
    render(<MyCardsSection onBack={() => {}} />);

    const btn = screen.getAllByRole('button', { name: /bloquear/i })[1];

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/desbloquear/i);
  });

  it('renderiza nome e mascara do cartão', () => {
    render(<MyCardsSection onBack={() => {}} />);

    expect(screen.getAllByText(/byte/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/••••••••/i).length).toBeGreaterThan(0);
  });
});