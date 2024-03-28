import { Center, Loader, Paper, SimpleGrid, Stack, Text } from '@mantine/core';

import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { ExplorerCollectionDetails } from './ExplorerCollectionDetails';
import { ExplorerPluginDetails } from './ExplorerPluginDetails';
import { useFetchAssetsByCollection } from '@/hooks/fetch';
import { ExplorerAssetCard } from './ExplorerAssetCard';

export function ExplorerCollection({ collection }: { collection: CollectionV1 }) {
  const { data: assets, error, isPending } = useFetchAssetsByCollection(collection.publicKey);
  return (
    <>
      <SimpleGrid cols={2} mt="xl" spacing="lg" pb="xl">
        <Paper p="xl" radius="md">
          <ExplorerCollectionDetails collection={collection} />
        </Paper>
        <Paper p="xl" radius="md">
          <ExplorerPluginDetails plugins={collection} type="collection" />
        </Paper>
      </SimpleGrid>
      <Stack>
        <Text fz="sm" tt="uppercase" fw={700} c="dimmed">Assets</Text>
        {isPending ? <Center h="20vh"><Loader /></Center> :
          error ? <Center h="20vh" ta="center"><Text>There was an error fetching assets in this collection.</Text></Center> : assets?.length ?
            <SimpleGrid
              cols={{
                base: 1,
                sm: 2,
                lg: 5,
                xl: 6,
              }}
            >
              {assets?.map((asset) => <ExplorerAssetCard asset={asset} key={asset.publicKey} />)}
            </SimpleGrid> : <Center h="20vh" ta="center"><Text>This collection does not have any assets.</Text></Center>}
      </Stack>
    </>
  );
}
