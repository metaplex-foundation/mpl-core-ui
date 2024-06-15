'use client';

import { Center, Container, Paper, Text } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { Collect } from '@/components/Collect/Collect';

export default function CreatePage() {
  const wallet = useWallet();

  return (
    <Container size="xl" pb="xl">
      {wallet.connected ? <Collect /> :
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
