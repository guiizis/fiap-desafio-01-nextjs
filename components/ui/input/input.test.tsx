import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input, inputClasses } from './input';

describe('inputClasses', () => {
  it('gera as classes base do input', () => {
    const className = inputClasses();

    expect(className).toContain('border-border');
    expect(className).toContain('focus-visible:ring-primary');
    expect(className).toContain('placeholder:text-subtle');
  });

  it('concatena className customizada', () => {
    const className = inputClasses({ className: 'max-w-[165px]' });

    expect(className).toContain('max-w-[165px]');
  });
});

describe('Input', () => {
  it('usa o name como fallback para htmlFor/id', () => {
    render(<Input label="Senha" name="senha" placeholder="Digite sua senha" />);

    const input = screen.getByLabelText('Senha');
    expect(input).toHaveAttribute('id', 'senha');
    expect(input).toHaveAttribute('placeholder', 'Digite sua senha');
  });

  it('respeita id informado e classes customizadas', () => {
    const { container } = render(
      <Input
        label="Nome"
        id="nome-completo"
        inputClassName="max-w-[280px]"
        containerClassName="pt-2"
      />
    );

    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAttribute('id', 'nome-completo');
    expect(input.className).toContain('max-w-[280px]');
    expect(container.firstChild).toHaveClass('pt-2');
  });

  it('aplica classe e mensagem de erro quando informado', () => {
    render(
      <Input
        label="Email"
        id="email"
        name="email"
        errorMessage="Dado incorreto. Revise e digite novamente."
        hasError
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-error');
    expect(input.getAttribute('aria-describedby')).toContain('email-error');
    expect(screen.getByText('Dado incorreto. Revise e digite novamente.')).toHaveAttribute(
      'id',
      'email-error'
    );
  });

  it('aplica constraints default quando tipo e email', () => {
    render(<Input label="Email" name="email" type="email" />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('required');
  });

  it('valida no blur quando validationKind informado', () => {
    render(<Input label="Email" name="email" type="email" validationKind="email" />);

    const input = screen.getByLabelText('Email');
    fireEvent.blur(input, { target: { value: 'email-invalido' } });

    expect(screen.getByText('Dado incorreto. Revise e digite novamente.')).toBeInTheDocument();
  });

  it('revalida no change quando ja existe erro interno', () => {
    render(<Input label="Email" name="email" type="email" validationKind="email" />);

    const input = screen.getByLabelText('Email');
    fireEvent.blur(input, { target: { value: 'email-invalido' } });
    fireEvent.change(input, { target: { value: 'ok@mail.com' } });

    expect(
      screen.queryByText('Dado incorreto. Revise e digite novamente.')
    ).not.toBeInTheDocument();
  });

  it('repassa handlers externos', () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    const onInvalid = vi.fn();

    render(
      <Input
        label="Senha"
        name="senha"
        type="password"
        validationKind="password"
        onBlur={onBlur}
        onChange={onChange}
        onInvalid={onInvalid}
      />
    );

    const input = screen.getByLabelText('Senha');
    fireEvent.blur(input, { target: { value: '123' } });
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.invalid(input, { target: { value: '' } });

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInvalid).toHaveBeenCalledTimes(1);
  });

  it('nao cria erro interno quando kind resolvido for none', () => {
    render(<Input label="Complemento" name="complemento" type="text" />);

    fireEvent.blur(screen.getByLabelText('Complemento'), { target: { value: '' } });

    expect(screen.queryByText('Campo obrigatório.')).not.toBeInTheDocument();
  });

  it('respeita modo controlado de erro sem alterar mensagem no blur', () => {
    render(
      <Input
        label="Email"
        name="email"
        type="email"
        validationKind="email"
        hasError
        errorMessage="Erro externo"
      />
    );

    fireEvent.blur(screen.getByLabelText('Email'), { target: { value: 'ok@mail.com' } });

    expect(screen.getByText('Erro externo')).toBeInTheDocument();
  });
});
