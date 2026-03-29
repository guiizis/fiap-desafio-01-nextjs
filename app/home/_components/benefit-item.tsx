import Image from "next/image";

type BenefitItemProps = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
};

export function BenefitItem({
  iconSrc,
  iconAlt,
  title,
  description,
}: BenefitItemProps) {
  return (
    <article className="flex flex-col items-center gap-3 text-center">
      <Image src={iconSrc} alt={iconAlt} width={56} height={56} />
      <h3 className="text-title-lg font-semibold text-secondary">{title}</h3>
      <p className="max-w-[260px] text-body-md text-subtle">{description}</p>
    </article>
  );
}
