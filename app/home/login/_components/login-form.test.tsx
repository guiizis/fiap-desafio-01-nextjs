import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from './login-form';

const { loginTriggerMock, loginUnwrapMock, pushMock, dispatchMock } = vi.hoisted(() => ({
  loginTriggerMock: vi.fn(),
  loginUnwrapMock: vi.fn(),
  pushMock: vi.fn(),
  dispatchMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock('@/app/dashboard/_state/hooks', () => ({ useAppDispatch: () => dispatchMock }));
vi.mock('@/app/dashboard/_state/bank-api', () => ({
  useLoginMutation: () => [loginTriggerMock],
  bankApi: {
    util: {
      upsertQueryData: (...args: unknown[]) => ({ type: 'bankApi/upsertSession', args }),
    },
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginUnwrapMock.mockResolvedValue({
      message: 'Login realizado com sucesso.',
      user: { id: 'user-1', name: 'Joana', email: 'joana@mail.com' },
    });
    loginTriggerMock.mockReturnValue({ unwrap: loginUnwrapMock });
    dispatchMock.mockResolvedValue(undefined);
    sessionStorage.clear();
  });

  const fillValidForm = () => {
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'user@mail.com' } });
    fireEvent.input(screen.getByLabelText('Senha'), { target: { value: '12345678' } });
  };

  it('renderiza campos principais e botão de acesso', () => {
    render(<LoginForm />);
    expect(screen.getByRole('heading', { name: 'Login', level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /esqueci a senha/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /acessar/i })).toBeInTheDocument();
  });

  it('mantém o campo de senha com largura total no modal', () => {
    render(<LoginForm layout="modal" />);
    const password = screen.getByLabelText('Senha');
    expect(password.className).toContain('w-full');
    expect(password.className).not.toContain('max-w-[165px]');
  });

  it('aplica as restrições e só habilita o botão com formulário válido', () => {
    render(<LoginForm layout="modal" />);
    const button = screen.getByRole('button', { name: /acessar/i });
    expect(screen.getByLabelText('Email')).toHaveAttribute('required');
    expect(screen.getByLabelText('Senha')).toHaveAttribute('minLength', '8');
    expect(button).toBeDisabled();
    fillValidForm();
    expect(button).toBeEnabled();
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'email-invalido' } });
    expect(button).toBeDisabled();
  });

  it('preenche o cache de sessão antes de redirecionar', async () => {
    const user = {
      id: 'user-1',
      name: 'Joana da Silva Oliveira',
      email: 'joana@mail.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      accountBalanceInCents: 250000,
    };
    loginUnwrapMock.mockResolvedValue({ message: 'Login realizado com sucesso.', user });
    render(<LoginForm layout="modal" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /acessar/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/dashboard/home'));
    expect(loginTriggerMock).toHaveBeenCalledWith({
      email: 'user@mail.com',
      password: '12345678',
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'bankApi/upsertSession',
      args: ['getSession', undefined, { user }],
    });
    expect(dispatchMock.mock.invocationCallOrder[0]).toBeLessThan(
      pushMock.mock.invocationCallOrder[0]
    );
    expect(sessionStorage).toHaveLength(0);
  });

  it('usa valores vazios quando FormData retorna null', async () => {
    loginUnwrapMock.mockRejectedValue({ data: { message: 'Dados obrigatórios ausentes.' } });
    render(<LoginForm layout="modal" />);
    const formDataGetSpy = vi.spyOn(FormData.prototype, 'get').mockReturnValue(null);
    const form = screen
      .getByRole('button', { name: /acessar/i })
      .closest('form') as HTMLFormElement;
    fireEvent.submit(form);
    await waitFor(() => expect(loginTriggerMock).toHaveBeenCalledWith({ email: '', password: '' }));
    formDataGetSpy.mockRestore();
  });

  it('mostra a mensagem devolvida pelo servidor e não navega', async () => {
    loginUnwrapMock.mockRejectedValue({ data: { message: 'Email ou senha inválidos.' } });
    render(<LoginForm layout="modal" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /acessar/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos.');
    expect(pushMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('usa mensagem segura quando a falha não contém resposta da API', async () => {
    loginUnwrapMock.mockRejectedValue(new Error('offline'));
    render(<LoginForm layout="modal" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /acessar/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível realizar o login. Tente novamente.'
    );
  });

  it('fecha o alerta manualmente', async () => {
    loginUnwrapMock.mockRejectedValue({ data: { message: 'Falha ao autenticar' } });
    render(<LoginForm layout="modal" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /acessar/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Falha ao autenticar');
    fireEvent.click(screen.getByRole('button', { name: /fechar alerta/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
