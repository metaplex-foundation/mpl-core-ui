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
import { Env, envOptions } from './useEnv';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryEnv = searchParams.get('env');
  const [client] = useState(new QueryClient());
  const [env, setEnv] = useState<Env>((queryEnv === 'mainnet' || queryEnv === 'devnet') ? queryEnv : 'mainnet');

  const doSetEnv = (e: Env) => {
    const params = new URLSearchParams(window.location.search);
    params.set('env', e);

    setEnv(e);
    router.push(`${pathname}?${params.toString()}`);
  };

  // useEffect(() => {
  //   if (env === 'devnet' && queryEnv !== 'devnet') {
  //     doSetEnv('devnet');
  //   }
  // }, []);

  const endpoint = useMemo(() => envOptions.find(({ env: e }) => e === env)?.endpoint, [env]);

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
                      <Header env={env} envOptions={envOptions} setEnv={doSetEnv} />
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
