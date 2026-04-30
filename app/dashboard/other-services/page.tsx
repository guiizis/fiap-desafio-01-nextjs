'use client';

import { useAuthSessionContext } from '@/app/context/auth-session-context';
import { OtherServicesPanel } from '../_components/other-services-panel';

export default function OtherServicesPage() {
  const { session } = useAuthSessionContext();

  if (!session) {
    return null;
  }

  return <OtherServicesPanel />;
}
