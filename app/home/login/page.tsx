import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-start px-4 py-8 md:py-12">
      <LoginForm layout="page" />
    </main>
  );
}
