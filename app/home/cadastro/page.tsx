import { CadastroForm } from "./_components/cadastro-form";

export default function CadastroPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-start px-4 py-8 md:py-12">
      <CadastroForm layout="page" />
    </main>
  );
}