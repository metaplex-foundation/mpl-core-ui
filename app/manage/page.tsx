'use client';

import { Center, Container, Paper, Text } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { ManageLanding } from '@/components/Manage/ManageLanding';

export default function ManagePage() {
  const wallet = useWallet();
  return (
    <Container size="xl" pb="xl">
      {wallet.connected ? <ManageLanding /> :
        <>
          <Text size="lg" mt="xl" mb="lg">Your Assets</Text>
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
