'use client';

import { Center, Container, Paper, Text } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLanding } from '@/components/Explorer/ExplorerLanding';
import { ExplorerSearch } from '@/components/Explorer/ExplorerSearch';

export default function ExplorerPage() {
  const wallet = useWallet();
  return (
    <Container size="xl" pb="xl">
        <Container size="sm" mt="xl">
          <ExplorerSearch />
        </Container>
      {wallet.connected ? <ExplorerLanding /> :
        <>
        <Container size="sm">
          <Paper mt="xl">
            <Center h="20vh">
              <Text>Connect your wallet to see your assets.</Text>
            </Center>
          </Paper>
        </Container>
        </>
      }
    </Container>);
}
