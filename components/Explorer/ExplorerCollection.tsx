import { Paper, SimpleGrid } from '@mantine/core';

import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { ExplorerCollectionDetails } from './ExplorerCollectionDetails';
import { ExplorerPluginDetails } from './ExplorerPluginDetails';

export function ExplorerCollection({ collection }: { collection: CollectionV1 }) {
  return (
    <SimpleGrid cols={2} mt="xl" spacing="lg" pb="xl">
      <Paper p="xl" radius="md">
        <ExplorerCollectionDetails collection={collection} />
      </Paper>
      <Paper p="xl" radius="md">
        <ExplorerPluginDetails plugins={collection} type="collection" />
      </Paper>
    </SimpleGrid>
  );
}
