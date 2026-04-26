'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Enviar email
  const handleSendEmail = () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Digite um email válido');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('reset');
      setSuccess('Email enviado! Agora defina sua nova senha.');
    }, 1000);
  };

  // 🔹 Reset senha
  const handleResetPassword = () => {
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess('Senha alterada com sucesso!');

      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 1000);
  };

  // 🔹 Força da senha
  const getPasswordStrength = () => {
    if (newPassword.length > 8) return 'strong';
    if (newPassword.length > 5) return 'medium';
    if (newPassword.length > 0) return 'weak';
    return '';
  };

  const strength = getPasswordStrength();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow">
        
        {step === 'email' ? (
          <>
            <h1 className="mb-4 text-xl font-bold">Recuperar senha</h1>

            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full rounded-md border p-2 mb-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
            />

            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            {success && <p className="text-sm text-green-500 mb-2">{success}</p>}

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full rounded-md cursor-pointer bg-orange-500 py-2 text-white disabled:opacity-50 transition"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-xl font-bold">Nova senha</h1>

            {/* NOVA SENHA */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite a nova senha"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                className="w-full rounded-md border p-2 mb-2 focus:ring-2 focus:ring-green-500 outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm text-gray-500"
              >
                👁️
              </button>
            </div>

            {/* BARRA DE FORÇA */}
            {newPassword && (
              <div className="h-2 w-full bg-gray-200 rounded mb-3">
                <div
                  className={`h-2 rounded transition-all duration-300 ${
                    strength === 'strong'
                      ? 'bg-green-500 w-full'
                      : strength === 'medium'
                      ? 'bg-yellow-500 w-2/3'
                      : 'bg-red-500 w-1/3'
                  }`}
                />
              </div>
            )}

            {/* CONFIRMAR SENHA */}
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              className="w-full rounded-md border p-2 mb-3 focus:ring-2 focus:ring-green-500 outline-none transition"
            />

            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            {success && <p className="text-sm text-green-500 mb-2">{success}</p>}

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-green-500 py-2 text-white disabled:opacity-50 transition"
            >
              {loading ? 'Alterando...' : 'Alterar senha'}
            </button>

            {/* VOLTAR */}
            <button
              onClick={() => router.push('/')}
              className="mt-3 text-sm cursor-pointer text-gray-500 underline w-full"
            >
              Voltar para login
            </button>
          </>
        )}
      </div>
    </div>
  );
}                                                                     