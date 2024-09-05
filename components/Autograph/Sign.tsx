import { Button, Paper, Space, TextInput } from '@mantine/core';
import { collectionAddress, updatePlugin } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { transactionBuilder } from '@metaplex-foundation/umi';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function Sign({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { invalidate } = useInvalidateFetchAssetWithCollection();

  const handleAddAutograph = useCallback(async () => {
    try {
      setLoading(true);
      let tx = transactionBuilder();

      if (asset.autograph) {
        tx = tx.add(updatePlugin(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: {
            type: 'Autograph',
            signatures: [...asset.autograph.signatures, {
              address: umi.identity.publicKey,
              message,
            }],
          },
        }));
      }

      const res = await tx.sendAndConfirm(umi, {send: { skipPreflight: true}});

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
    <Paper p="xl" radius="md">
      <TextInput
        label="Message"
        placeholder="To my biggest fan, love Satoshi"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
      <Space h="lg" />
      <Button onClick={handleAddAutograph} loading={loading}>Sign</Button>
    </Paper>
  );
}
