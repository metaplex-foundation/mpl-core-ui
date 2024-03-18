import { Flex, Loader, Paper, SimpleGrid, Text } from '@mantine/core';
import { AssetV1 } from 'core-preview';
import { ExplorerAssetDetails } from './ExplorerAssetDetails';
import { ExplorerPluginDetails } from './ExplorerPluginDetails';
import { useFetchCollection } from '@/hooks/fetch';

const CollectionPluginDetails = ({ mint }: { mint: string }) => {
  const { isLoading, isError, data: collection } = useFetchCollection(mint);
  return (
    <>
      {isLoading && <Loader />}
      {isError && <Text>Error fetching collection</Text>}
      {collection && <ExplorerPluginDetails plugins={collection} type="collection" />}
    </>
  );
};

export function Explorer({ asset }: { asset: AssetV1 }) {
  return (
    <SimpleGrid cols={2} mt="xl" spacing="lg" pb="xl">
      <Paper p="xl" radius="md">
        <ExplorerAssetDetails asset={asset} />
      </Paper>
      <Flex direction="column">
        <Paper p="xl" radius="md">
          <ExplorerPluginDetails plugins={asset} type="asset" />
        </Paper>

        {asset.updateAuthority.type === 'Collection' && (
        <Paper
          p="xl"
          radius="md"
          mt="lg"
          style={{
          flexGrow: 1,
        }}
        >
          <CollectionPluginDetails mint={asset.updateAuthority.address || ''} />
        </Paper>
        )}
      </Flex>
    </SimpleGrid>
  );
}
