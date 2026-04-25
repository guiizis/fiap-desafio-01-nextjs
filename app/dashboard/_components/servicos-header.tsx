import Image from 'next/image';

type DashboardHeaderProps = {
  userName: string;
};

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="w-full bg-primary text-surface">
      <div className="mx-auto flex w-full max-w-[1140px] items-center justify-end gap-4 px-4 py-4 md:px-0">
        <span className="text-body-sm">{userName}</span>
        <button
          type="button"
          aria-label="Perfil do usuario"
          className="inline-flex h-10 w-10 items-center justify-center"
        >
          <Image src="/dashboard/avatar.svg" alt="" width={40} height={40} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
