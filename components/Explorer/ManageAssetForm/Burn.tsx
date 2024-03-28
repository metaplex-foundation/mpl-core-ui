import { Button } from '@mantine/core';
import { burnV1, collectionAddress } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function Burn({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();

  const handleBurn = useCallback(async () => {
    try {
      setLoading(true);
      const res = await burnV1(umi, {
        asset: asset.publicKey,
        collection: collectionAddress(asset),
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Burn complete', sig);
      notifications.show({ title: 'Burn complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Burn failed', error);
      notifications.show({ title: 'Burn failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, asset]);
  return (
    <Button onClick={handleBurn} loading={loading} color="red">Burn</Button>
  );
}
