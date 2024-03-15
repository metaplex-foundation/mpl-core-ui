'use client';

import { Center, Container, Loader, Text } from '@mantine/core';
import { ExplorerCollection } from '@/components/Explorer/ExplorerCollection';
import { useFetchCollection } from '@/hooks/fetch';

export default function ExplorerCollectionPage({ params }: { params: { mint: string } }) {
  const { mint } = params;
  const { error, isPending, data: collection } = useFetchCollection(mint);
  return (
    <Container size="xl" pb="xl">
      {isPending &&
        <Center h="20vh">
          <Loader />
        </Center>
      }
      {error &&
      <Center h="20vh">
        <Text>Collection does not exist</Text>
      </Center>}
      {collection && <ExplorerCollection collection={collection} />}
    </Container>);
}
