import { Button } from '@mantine/core';
import { collectionAddress, addPlugin } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function AddAutographPlugin({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();

  const handleAddAutograph = useCallback(async () => {
    try {
      setLoading(true);

      const tx = addPlugin(umi, {
        asset: asset.publicKey,
        collection: collectionAddress(asset),
        plugin: {
          type: 'Autograph',
          signatures: [],
        },
      });

      const res = await tx.sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Autograph plugin added', sig);
      notifications.show({ title: 'Adding Autograph plugin complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Adding Autograph plugin failed', error);
      notifications.show({ title: 'Adding Autograph plugin failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, asset]);
  return (
    <Button onClick={handleAddAutograph} loading={loading}>Add Autograph Plugin</Button>
  );
}
