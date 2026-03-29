import Image from "next/image";
import Link from "next/link";
import { Logo } from "../../../components/ui/logo";

export function HomeFooter() {
  return (
    <footer className="mt-auto w-full bg-black text-surface">
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-6 py-6 md:grid-cols-3 md:gap-10 lg:px-12">
        <section className="space-y-2">
          <h2 className="text-body-md font-semibold text-surface">Servicos</h2>
          <ul className="space-y-1.5 text-body-md text-surface">
            <li>Conta corrente</li>
            <li>Conta PJ</li>
            <li>Cartao de credito</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-body-md font-semibold text-surface">Contato</h2>
          <ul className="space-y-1.5 text-body-md text-surface">
            <li>0800 004 250 08</li>
            <li>meajuda@mcintoshbank.com.br</li>
            <li>ouvidoria@mcintoshbank.com.br</li>
          </ul>
        </section>

        <section className="space-y-2 md:justify-self-end">
          <h2 className="text-body-md font-semibold text-surface">
            Desenvolvido por Mcintosh Bank
          </h2>
          <Logo size="md" variant="full" tone="light" alt="Mcintosh Bank" />

          <div className="flex items-center gap-4 pt-0.5">
            <Link href="#" aria-label="Instagram da Mcintosh Bank">
              <Image
                src="/icons/insta.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="block"
              />
            </Link>
            <Link href="#" aria-label="WhatsApp da Mcintosh Bank">
              <Image
                src="/icons/whatsapp.svg"
                alt="WhatsApp"
                width={24}
                height={24}
                className="block"
              />
            </Link>
            <Link href="#" aria-label="YouTube da Mcintosh Bank">
              <Image
                src="/icons/yt.svg"
                alt="YouTube"
                width={24}
                height={24}
                className="block"
              />
            </Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
