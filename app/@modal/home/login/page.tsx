import { ModalShell } from '../../_components/modal-shell';
import { LoginForm } from '../../../home/login/_components/login-form';

export default function LoginModalPage() {
  return (
    <ModalShell dialogLabel="Login">
      <LoginForm layout="modal" />
    </ModalShell>
  );
}
