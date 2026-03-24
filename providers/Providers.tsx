'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ReactNode, useMemo, useState } from 'react';
import { Notifications } from '@mantine/notifications';
import { AppShell } from '@mantine/core';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { UmiProvider } from './UmiProvider';
import { EnvProvider } from './EnvProvider';
import { Env, getEnvOptions, getEnvOption } from './useEnv';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryEnv = searchParams.get('env');
  const [client] = useState(new QueryClient());
  const envOptions = useMemo(() => getEnvOptions(), []);
  const [env, setEnv] = useState<Env>(() => {
    if (queryEnv) {
      const match = getEnvOption(queryEnv as Env);
      if (match) return match.env;
    }
    return envOptions[0]?.env ?? 'mainnet';
  });

  const doSetEnv = (e: Env) => {
    const params = new URLSearchParams(window.location.search);
    params.set('env', e);

    setEnv(e);
    router.push(`${pathname}?${params.toString()}`);
  };

  const endpoint = useMemo(() => {
    const option = getEnvOption(env);
    return option?.endpoint ?? getEnvOption('mainnet')?.endpoint;
  }, [env]);

  return (
    <EnvProvider env={env!}>
      <ConnectionProvider endpoint={endpoint!}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <UmiProvider>
              <QueryClientProvider client={client}>
                <ReactQueryStreamedHydration>
                  <Notifications />
                  <AppShell
                    header={{ height: { base: 140, md: 80 } }}
                    style={{
                      backgroundColor: '#141414',
                    }}
                  >
                    <AppShell.Header bg="black" withBorder={false}>
                      <Header env={env} setEnv={doSetEnv} />
                    </AppShell.Header>
                    <AppShell.Main>
                      {children}
                    </AppShell.Main>
                  </AppShell>
                </ReactQueryStreamedHydration>
              </QueryClientProvider>
            </UmiProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </EnvProvider>
  );
}
