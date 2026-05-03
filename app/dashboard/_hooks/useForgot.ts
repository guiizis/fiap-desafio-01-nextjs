import { useState } from 'react';
import { sendResetEmail, resetPassword } from'../services/auth';

export const useForgot = (router: any) => {
  const [step, setStep] = useState<'email' | 'reset'>('email');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Digite um email válido');
      return;
    }

    setLoading(true);

    await sendResetEmail(email);

    setLoading(false);
    setStep('reset');
    setSuccess('Email enviado! Agora defina sua nova senha.');
  };

  const changePassword = async () => {
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

    await resetPassword(newPassword);

    setLoading(false);
    setSuccess('Senha alterada com sucesso!');

    router.push('/');
  };

  return {
    step,
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    loading,
    sendEmail,
    changePassword,
  };
};