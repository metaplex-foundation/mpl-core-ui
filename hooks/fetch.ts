import { publicKey } from '@metaplex-foundation/umi';
import { fetchAssetV1, fetchCollectionV1, getAssetV1GpaBuilder, Key, updateAuthority } from 'core-preview';
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
    queryFn: async () => fetchAssetV1(umi, publicKey(mint)),
  });
}

export function useFetchCollection(mint: string) {
  const umi = useUmi();
  const env = useEnv();
  return useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-collection', env, mint],
    queryFn: async () => fetchCollectionV1(umi, publicKey(mint)),
  });
}

export function useFetchAssetsByOwner(owner?: string) {
  const umi = useUmi();
  const env = useEnv();
  const o = owner ? publicKey(owner) : umi.identity.publicKey;
  return useQuery({
    queryKey: ['fetch-assets', env, o],
    queryFn: async () => {
      const result = await getAssetV1GpaBuilder(umi).whereField('owner', o).whereField('key', Key.AssetV1).getDeserialized();

      return result;
    },
  });
}

export function useFetchAssetsByCollection(collection: string) {
  const umi = useUmi();
  const env = useEnv();
  return useQuery({
    queryKey: ['fetch-assets-by-collection', env, collection],
    queryFn: async () => {
      const result = await getAssetV1GpaBuilder(umi).whereField('updateAuthority', updateAuthority('Collection', [publicKey(collection)])).whereField('key', Key.AssetV1).getDeserialized();

      return result;
    },
  });
}
