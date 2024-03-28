import { Button } from '@mantine/core';
import { TransactionBuilder, transactionBuilder } from '@metaplex-foundation/umi';
import { createPlugin, CollectionV1, addCollectionPluginV1, updateCollectionPluginV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { useInvalidateFetchCollectionsByUpdateAuthority } from '@/hooks/fetch';

export function PermanentFreeze({ collection }: { collection: CollectionV1 }) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchCollectionsByUpdateAuthority();
  const frozen = collection.permanentFreezeDelegate?.frozen;

  const handleFreeze = useCallback(async () => {
    try {
      setLoading(true);
      let tx: TransactionBuilder = transactionBuilder();

      if (!collection.freezeDelegate) {
        tx = addCollectionPluginV1(umi, {
          collection: collection.publicKey,
          plugin: createPlugin({
            type: 'PermanentFreezeDelegate',
            data: {
              frozen: true,
            },
          }),
        });
      } else {
        tx = updateCollectionPluginV1(umi, {
          collection: collection.publicKey,
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
      invalidate(collection.publicKey);
    } catch (error: any) {
      console.error('Freeze/unfreeze failed', error);
      notifications.show({ title: `${frozen ? 'Unfreeze' : 'Freeze'} failed`, message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, collection]);
  return (
    <Button onClick={handleFreeze} loading={loading}>{frozen ? 'Unfreeze' : 'Freeze'} collection</Button>
  );
}
