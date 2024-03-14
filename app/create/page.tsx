'use client';

import { Center, Container, Paper, Text } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { Create } from '@/components/Create/Create';

export default function CreatePage() {
  const wallet = useWallet();

  return (
    <Container size="xl" pb="xl">
      {wallet.connected ? <Create /> :
        <Container size="sm">
          <Paper mt="xl">
            <Center h="20vh">
              <Text>Connect your wallet to begin.</Text>
            </Center>
          </Paper>
        </Container>
      }
    </Container>);
}
