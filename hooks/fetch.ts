import { publicKey } from '@metaplex-foundation/umi';
import { AssetV1, collectionAddress, CollectionV1, deserializeAssetV1, deserializeCollectionV1, fetchAssetV1, fetchCollectionV1, getAssetV1GpaBuilder, getCollectionV1GpaBuilder, Key, updateAuthority } from '@metaplex-foundation/mpl-core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useFetchCollection(mint?: string) {
  const umi = useUmi();
  const env = useEnv();
  if (!mint) return { isPending: false, error: undefined, isLoading: false, isError: false, data: undefined };
  return useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-collection', env, mint],
    queryFn: async () => fetchCollectionV1(umi, publicKey(mint)),
  });
}

export function useInvalidateFetchAssetWithCollection() {
  const env = useEnv();
  const queryClient = useQueryClient();

  return {
    invalidate: (mint: string) => queryClient.invalidateQueries({ queryKey: ['fetch-asset-with-collection', env, mint] }),
  };
}

export function useFetchAssetWithCollection(mint: string) {
  const umi = useUmi();
  const env = useEnv();

  return useQuery({
    retry: false,
    refetchOnMount: true,
    queryKey: ['fetch-asset-with-collection', env, mint],
    queryFn: async () => {
      const asset = await fetchAssetV1(umi, publicKey(mint));
      const colAddr = collectionAddress(asset);
      let collection;
      if (colAddr) {
        collection = await fetchCollectionV1(umi, colAddr);
      }
      return { asset, collection };
    },
  });
}

export function useFetchAssetsByOwner(owner?: string) {
  const umi = useUmi();
  const env = useEnv();
  const o = owner ? publicKey(owner) : umi.identity.publicKey;
  return useQuery({
    queryKey: ['fetch-assets', env, o],
    queryFn: async () => {
      const accounts = await getAssetV1GpaBuilder(umi).whereField('owner', o).whereField('key', Key.AssetV1).get();
      // TODO use getDeserialized() instead of the following temporary workaround for devnet breaking changes
      return accounts.map((account) => {
        try {
          return deserializeAssetV1(account);
        } catch (e) {
          return null;
        }
      }).filter((a) => a) as AssetV1[];
    },
  });
}

export function useFetchAssetsByCollection(collection: string) {
  const umi = useUmi();
  const env = useEnv();
  return useQuery({
    queryKey: ['fetch-assets-by-collection', env, collection],
    queryFn: async () => {
      const accounts = await getAssetV1GpaBuilder(umi).whereField('updateAuthority', updateAuthority('Collection', [publicKey(collection)])).whereField('key', Key.AssetV1).get();
      return accounts.map((account) => {
        try {
          // TODO use getDeserialized() instead of the following temporary workaround for devnet breaking changes
          return deserializeAssetV1(account);
        } catch (e) {
          return null;
        }
      }).filter((a) => a) as AssetV1[];
    },
  });
}

export function useInvalidateFetchCollectionsByUpdateAuthority() {
  const env = useEnv();
  const queryClient = useQueryClient();

  return {
    invalidate: (updateAuth: string) => queryClient.invalidateQueries({ queryKey: ['fetch-asset-with-collection', env, updateAuth] }),
  };
}

export function useFetchCollectionsByUpdateAuthority(updateAuth: string) {
  const umi = useUmi();
  const env = useEnv();
  return useQuery({
    queryKey: ['fetch-collections', env, updateAuth],
    queryFn: async () => {
      try {
        const accounts = await getCollectionV1GpaBuilder(umi).whereField('updateAuthority', publicKey(updateAuth)).whereField('key', Key.CollectionV1).get();
        // TODO use getDeserialized() instead of the following temporary workaround for devnet breaking changes
        return accounts.map((account) => {
          try {
            return deserializeCollectionV1(account);
          } catch (e) {
            return null;
          }
        }).filter((a) => a) as CollectionV1[];
      } catch (err) {
        console.error('Error fetching collections', err);
        throw err;
      }
    },
  });
}
