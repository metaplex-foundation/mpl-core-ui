import { Center, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { ExplorerAssetCard } from './ExplorerAssetCard';
import { ExplorerCollectionList } from './ExplorerCollectionList';
import { useFetchAssetsByOwner } from '@/hooks/fetch';

export function ExplorerLanding() {
  const { error, isPending, data: assets } = useFetchAssetsByOwner();

  return (
    <Stack mt="lg">
      <Text size="lg">Your Core Assets</Text>
      {isPending ? <Center h="20vh"><Loader /></Center> :
        error ? <Center h="20vh" ta="center"><Text>There was an error fetching your Core assets.</Text></Center> : assets?.length ?
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
              lg: 5,
              xl: 6,
            }}
          >
            {assets?.map((asset) => <ExplorerAssetCard asset={asset} key={asset.publicKey} />)}
          </SimpleGrid> : <Center h="20vh" ta="center"><Text>You don&apos;t have any Core assets.</Text></Center>}
      <ExplorerCollectionList />
    </Stack>
  );
}
