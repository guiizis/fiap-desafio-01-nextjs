import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ForgotPasswordPage from './page';

// 🔥 mock router
const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// 🔥 mock API
vi.mock('./services/auth', () => ({
  sendResetEmail: vi.fn().mockResolvedValue(true),
  resetPassword: vi.fn().mockResolvedValue(true),
}));

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);
    return { user };
  };

  it('mostra erro se email vazio', async () => {
    const { user } = setup();

    await user.click(screen.getByText(/enviar/i));

    expect(
      screen.getByText(/digite um email válido/i)
    ).toBeInTheDocument();
  });

  it('avança para etapa de nova senha', async () => {
    const { user } = setup();

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      'teste@email.com'
    );

    await user.click(screen.getByText(/enviar/i));

    expect(await screen.findByText(/nova senha/i)).toBeInTheDocument();
  });

  it('mostra erro se senha curta', async () => {
    const { user } = setup();

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      'teste@email.com'
    );

    await user.click(screen.getByText(/enviar/i));
    await screen.findByText(/nova senha/i);

    await user.type(
      screen.getByPlaceholderText(/digite a nova senha/i),
      '123'
    );

    await user.type(
      screen.getByPlaceholderText(/confirme a nova senha/i),
      '123'
    );

    await user.click(screen.getByText(/alterar senha/i));

    expect(
      screen.getByText(/pelo menos 6 caracteres/i)
    ).toBeInTheDocument();
  });

  it('senhas diferentes', async () => {
    const { user } = setup();

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      'teste@email.com'
    );

    await user.click(screen.getByText(/enviar/i));
    await screen.findByText(/nova senha/i);

    await user.type(
      screen.getByPlaceholderText(/digite a nova senha/i),
      '123456'
    );

    await user.type(
      screen.getByPlaceholderText(/confirme a nova senha/i),
      '654321'
    );

    await user.click(screen.getByText(/alterar senha/i));

    expect(screen.getByText(/não coincidem/i)).toBeInTheDocument();
  });

  it('toggle senha', async () => {
    const { user } = setup();

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      'teste@email.com'
    );

    await user.click(screen.getByText(/enviar/i));
    await screen.findByText(/nova senha/i);

    const input = screen.getByPlaceholderText(/digite a nova senha/i);
    const toggle = screen.getByRole('button', { name: /👁️/i });

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggle);

    expect(input).toHaveAttribute('type', 'text');
  });

  it('redireciona após sucesso', async () => {
    const { user } = setup();

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      'teste@email.com'
    );

    await user.click(screen.getByText(/enviar/i));
    await screen.findByText(/nova senha/i);

    await user.type(
      screen.getByPlaceholderText(/digite a nova senha/i),
      '123456'
    );

    await user.type(
      screen.getByPlaceholderText(/confirme a nova senha/i),
      '123456'
    );

    await user.click(screen.getByText(/alterar senha/i));

    expect(pushMock).toHaveBeenCalledWith('/');
  });
});