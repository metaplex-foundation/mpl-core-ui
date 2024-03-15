'use client';

import { Center, Container, Loader, Text } from '@mantine/core';
import { Explorer } from '@/components/Explorer/Explorer';
import { useFetchAsset } from '@/hooks/fetch';

export default function ExplorerPage({ params }: { params: { mint: string } }) {
  const { mint } = params;
  const { error, isPending, data: asset } = useFetchAsset(mint);
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
      {asset && <Explorer asset={asset} />}
    </Container>);
}
