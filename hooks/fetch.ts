import { publicKey } from '@metaplex-foundation/umi';
import { fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core';
import { useQuery } from '@tanstack/react-query';
import { useEnv } from '@/providers/useEnv';
import { useUmi } from '@/providers/useUmi';

export function useFetchAsset(mint: string) {
  const umi = useUmi();
  const env = useEnv();
  return useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-nft', env, mint],
    queryFn: async () => fetchAsset(umi, publicKey(mint)),
  });
}

export function useFetchCollection(mint: string) {
  const umi = useUmi();
  const env = useEnv();
  return useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-collection', env, mint],
    queryFn: async () => fetchCollection(umi, publicKey(mint)),
  });
}
