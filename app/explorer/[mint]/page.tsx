'use client';

import { Center, Container, Loader, Text } from '@mantine/core';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import { fetchAsset } from '@metaplex-foundation/mpl-core';
import { Explorer } from '@/components/Explorer/Explorer';
import { useUmi } from '@/providers/useUmi';
import { useEnv } from '@/providers/useEnv';

export default function ExplorerPage({ params }: { params: { mint: string } }) {
  const env = useEnv();
  const umi = useUmi();
  const { mint } = params;
  const { error, isPending, data: asset } = useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-nft', env, mint],
    queryFn: async () => fetchAsset(umi, publicKey(mint)),
  });
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
