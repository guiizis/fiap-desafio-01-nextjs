import { BenefitItem } from "../_components/benefit-item";

const benefits = [
  {
    iconSrc: "/home/gift.svg",
    iconAlt: "Icone de presente",
    title: "Conta e cartao gratuitos",
    description:
      "Isso mesmo, nossa conta e digital, sem custo fixo e mais que isso: sem tarifa de manutencao.",
  },
  {
    iconSrc: "/home/withdraw.svg",
    iconAlt: "Icone de saque",
    title: "Saques sem custo",
    description: "Voce pode sacar gratuitamente 4x por mes de qualquer Banco 24h.",
  },
  {
    iconSrc: "/home/star.svg",
    iconAlt: "Icone de estrela",
    title: "Programa de pontos",
    description:
      "Voce pode acumular pontos com suas compras no credito sem pagar mensalidade!",
  },
  {
    iconSrc: "/home/devices.svg",
    iconAlt: "Icone de dispositivos",
    title: "Seguro Dispositivos",
    description:
      "Seus dispositivos moveis (computador e laptop) protegidos por uma mensalidade simbolica.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="w-full pb-14 pt-8 md:pb-20 md:pt-10" aria-labelledby="benefits-title">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <h2 id="benefits-title" className="text-center text-title-xl font-bold text-black">
          Vantagens do nosso banco:
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitItem
              key={benefit.title}
              iconSrc={benefit.iconSrc}
              iconAlt={benefit.iconAlt}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
