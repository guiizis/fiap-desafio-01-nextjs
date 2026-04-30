import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalendarInput } from './calendar-input';

describe('CalendarInput', () => {
  it('renderiza com range e propaga mudanca', () => {
    const onChange = vi.fn();

    render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="2026-04-19"
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText('Data');
    expect(input).toHaveAttribute('min', '2025-01-01');
    expect(input).toHaveAttribute('max', '2026-12-31');

    fireEvent.change(input, { target: { value: '2026-04-20' } });
    expect(onChange).toHaveBeenCalledWith('2026-04-20');
  });

  it('mostra erro para data fora do intervalo e notifica validade', () => {
    const onValidityChange = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="2026-04-19"
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={onChange}
        onValidityChange={onValidityChange}
      />
    );

    expect(onValidityChange).toHaveBeenLastCalledWith(true);

    rerender(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="275760-04-19"
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={onChange}
        onValidityChange={onValidityChange}
      />
    );

    fireEvent.blur(screen.getByLabelText('Data'));

    expect(onValidityChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText(/Informe uma data entre/i)).toBeInTheDocument();
  });

  it('usa range padrao com ano atual e ano anterior quando min/max nao sao informados', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-19T12:00:00.000Z'));

    try {
      render(
        <CalendarInput label="Data" name="transaction-date" value="2026-04-19" onChange={vi.fn()} />
      );

      const input = screen.getByLabelText('Data');
      expect(input).toHaveAttribute('min', '2025-01-01');
      expect(input).toHaveAttribute('max', '2026-12-31');
    } finally {
      vi.useRealTimers();
    }
  });

  it('mostra erro de campo obrigatório e chama onBlur quando valor esta vazio', () => {
    const onBlur = vi.fn();

    render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value=""
        required
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={vi.fn()}
        onBlur={onBlur}
      />
    );

    const input = screen.getByLabelText('Data');
    fireEvent.blur(input);

    expect(screen.getByText('Campo obrigatório.')).toBeInTheDocument();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('nao exibe erro de obrigatoriedade quando required e falso', () => {
    render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value=""
        minDate="2025-01-01"
        maxDate="2026-12-31"
        onChange={vi.fn()}
      />
    );

    fireEvent.blur(screen.getByLabelText('Data'));
    expect(screen.queryByText('Campo obrigatório.')).not.toBeInTheDocument();
  });

  it('revalida durante onChange apos blur e limpa erro com data valida', () => {
    function CalendarHarness() {
      const [value, setValue] = useState('2027-01-01');
      return (
        <CalendarInput
          label="Data"
          name="transaction-date"
          value={value}
          minDate="2025-01-01"
          maxDate="2026-12-31"
          onChange={setValue}
          required
        />
      );
    }

    render(<CalendarHarness />);

    const input = screen.getByLabelText('Data');
    fireEvent.blur(input);
    expect(screen.getByText(/Informe uma data entre/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '2026-04-19' } });
    expect(screen.queryByText(/Informe uma data entre/i)).not.toBeInTheDocument();
  });

  it('mostra erro quando minDate ou maxDate sao invalidos', () => {
    render(
      <CalendarInput
        label="Data"
        name="transaction-date"
        value="2026-04-19"
        minDate="2026-02-31"
        maxDate="2026-12-31"
        onChange={vi.fn()}
      />
    );

    fireEvent.blur(screen.getByLabelText('Data'));
    expect(screen.getByText(/2026-02-31/)).toBeInTheDocument();
  });
});
