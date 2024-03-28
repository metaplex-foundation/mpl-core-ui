import { Button } from '@mantine/core';
import { TransactionBuilder, transactionBuilder } from '@metaplex-foundation/umi';
import { addPluginV1, createPlugin, collectionAddress, updatePluginV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function PermanentFreeze({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const frozen = asset.permanentFreezeDelegate?.frozen;

  const handleFreeze = useCallback(async () => {
    try {
      setLoading(true);
      let tx: TransactionBuilder = transactionBuilder();

      if (!asset.permanentFreezeDelegate) {
        tx = addPluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: 'PermanentFreezeDelegate',
            data: {
              frozen: true,
            },
          }),
        });
      } else {
        tx = updatePluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: 'PermanentFreezeDelegate',
            data: {
              frozen: !frozen,
            },
          }),
        });
      }

      const res = await tx.sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Freeze/unfreeze complete', sig);
      notifications.show({ title: `${frozen ? 'Unfreeze' : 'Freeze'} complete`, message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Freeze/unfreeze failed', error);
      notifications.show({ title: `${frozen ? 'Unfreeze' : 'Freeze'} failed`, message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, asset]);
  return (
    <Button onClick={handleFreeze} loading={loading}>{frozen ? 'Unfreeze' : 'Freeze'} via permanent plugin</Button>
  );
}
