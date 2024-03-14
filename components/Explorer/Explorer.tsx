import { Paper, SimpleGrid } from '@mantine/core';

import { Asset } from '@metaplex-foundation/mpl-core';
import { ExplorerAssetDetails } from './ExplorerAssetDetails';

export function Explorer({ asset }: { asset: Asset }) {
  return (
    <SimpleGrid cols={2} mt="xl" spacing="lg" pb="xl">
      <Paper p="xl" radius="md">
        <ExplorerAssetDetails asset={asset} />
      </Paper>
    </SimpleGrid>
  );
}
