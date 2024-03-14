'use client';

import { Center, Container, Loader, Text } from '@mantine/core';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import { Manage } from '@/components/Manage/Manage';
import { useUmi } from '@/providers/useUmi';
import { useEnv } from '@/providers/useEnv';

export default function ManagePage({ params }: { params: { mint: string } }) {
  const env = useEnv();
  const umi = useUmi();
  const { mint } = params;
  const { error, isPending, data: nft } = useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-nft', env, mint],
    queryFn: async () => umi.rpc.getAsset(publicKey(mint)),
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
          <Text>NFT does not exist</Text>
        </Center>}
      {nft && <Manage nft={nft} />}
    </Container>);
}
