import { ModalShell } from "../../_components/modal-shell";
import { CadastroForm } from "../../../home/cadastro/_components/cadastro-form";

export default function CadastroModalPage() {
  return (
    <ModalShell>
      <CadastroForm layout="modal" />
    </ModalShell>
  );
}
