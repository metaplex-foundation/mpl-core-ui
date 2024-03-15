'use client';

import { Center, Container, Loader, Text } from '@mantine/core';
import { Manage } from '@/components/Manage/Manage';
import { useFetchAsset } from '@/hooks/fetch';

export default function ManagePage({ params }: { params: { mint: string } }) {
  const { mint } = params;
  const { error, isPending, data: nft } = useFetchAsset(mint);
  return (
    <Container size="xl" pb="xl">
      {isPending &&
        <Center h="20vh">
          <Loader />
        </Center>
      }
      {error &&
        <Center h="20vh">
          <Text>Asset does not exist</Text>
        </Center>}
      {nft && <Manage />}
    </Container>);
}
