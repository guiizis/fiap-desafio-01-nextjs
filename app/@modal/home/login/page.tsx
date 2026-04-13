import { ModalShell } from "../../_components/modal-shell";
import { LoginForm } from "../../../home/login/_components/login-form";

export default function LoginModalPage() {
  return (
    <ModalShell>
      <LoginForm layout="modal" />
    </ModalShell>
  );
}
