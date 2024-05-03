'use client';

import { Button, Center, Container, Group, Paper, Text, Title } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { IconFileDescription } from '@tabler/icons-react';
import { OracleDemo } from './OracleDemo';

export default function CreatePage() {
  const wallet = useWallet();

  return (
    <Container size="xl" pb="xl">
      <Group justify="space-between">
        <div>
          <Title mt="lg" order={2}>Oracle Demo</Title>
          <Text fz="sm" c="dimmed">Make sure to use devnet to avoid using mainnet SOL</Text>
        </div>
        <div>
          <Link href="https://developers.metaplex.com/core">
            <Button variant="default" leftSection={<IconFileDescription />}>Documentation</Button>
          </Link>
        </div>
      </Group>
      {wallet.connected ? <OracleDemo /> :
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
