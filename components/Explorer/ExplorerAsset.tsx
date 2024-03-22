import { Flex, Paper, SimpleGrid } from '@mantine/core';
import { ExplorerAssetDetails } from './ExplorerAssetDetails';
import { ExplorerPluginDetails } from './ExplorerPluginDetails';
import { AssetWithCollection } from '@/lib/type';

export function ExplorerAsset({ asset, collection }: AssetWithCollection) {
  return (
    <SimpleGrid cols={2} mt="xl" spacing="lg" pb="xl">
      <Paper p="xl" radius="md">
        <ExplorerAssetDetails asset={asset} collection={collection} />
      </Paper>
      <Flex direction="column">
        <Paper p="xl" radius="md">
          <ExplorerPluginDetails plugins={asset} type="asset" />
        </Paper>

        {collection && (
        <Paper
          p="xl"
          radius="md"
          mt="lg"
          style={{
          flexGrow: 1,
        }}
        >
          <ExplorerPluginDetails plugins={collection} type="collection" />
        </Paper>
        )}
      </Flex>
    </SimpleGrid>
  );
}
