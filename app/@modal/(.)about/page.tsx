import { ModalShell } from '../_components/modal-shell';
import { AboutContent } from '../../about/_components/about-content';

export default function AboutModalPage() {
  return (
    <ModalShell
      closeLabel="Fechar sobre"
      panelClassName="max-w-3xl bg-surface"
      contentClassName="p-0"
    >
      <AboutContent variant="modal" />
    </ModalShell>
  );
}
