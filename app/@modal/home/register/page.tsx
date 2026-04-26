import { ModalShell } from "../../_components/modal-shell";
import { RegisterForm } from "../../../home/register/_components/register-form";

export default function RegisterModalPage() {
  return (
    <ModalShell>
      <RegisterForm layout="modal" />
    </ModalShell>
  );
}
