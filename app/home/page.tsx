import Link from "next/link";
import { buttonVariants } from "../../components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="w-full bg-black">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-3 px-4 py-3 lg:px-6">
          <Link
            href="/abrir-conta"
            className={buttonVariants({
              variant: "solid",
              tone: "secondary",
              className: "px-6",
            })}
          >
            Abrir minha conta
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              tone: "secondary",
              className: "px-6",
            })}
          >
            Já tenho conta
          </Link>
        </div>
      </header>
    </main>
  );
}
