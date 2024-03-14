import { useQuery } from '@tanstack/react-query';
import { Box, Center, Loader, SimpleGrid, Text } from '@mantine/core';
import { getAssetGpaBuilder } from '@metaplex-foundation/mpl-core';
import { useUmi } from '@/providers/useUmi';
import { useEnv } from '@/providers/useEnv';
import { ExplorerAssetCard } from './ExplorerAssetCard';

export function ExplorerLanding() {
  const umi = useUmi();
  const env = useEnv();

  const { error, isPending, data: assets } = useQuery({
    queryKey: ['fetch-assets', env, umi.identity.publicKey],
    queryFn: async () => {
      const result = await getAssetGpaBuilder(umi).whereField('owner', umi.identity.publicKey).getDeserialized();

      return result;
    },
  });

  return (
    <Box mt="xl">
      <Text mb="lg" size="lg">Your Core assets</Text>
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
    </Box>
  );
}
