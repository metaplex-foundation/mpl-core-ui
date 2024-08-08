import { Button, CloseButton, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TransactionBuilder, transactionBuilder } from '@metaplex-foundation/umi';
import { addPluginV1, createPlugin, collectionAddress, updatePluginV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function Edition({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const form = useForm({
    initialValues: {
      number: asset.edition?.number ?? 0,
    },
    validateInputOnBlur: true,
    validate: {

    },
  });

  const handleAttributes = useCallback(async () => {
    try {
      setLoading(true);
      let tx: TransactionBuilder = transactionBuilder();

      if (!asset.edition) {
        tx = addPluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: 'Edition',
            data: {
              number: form.values.number
            },
          }),
        });
      } else {
        tx = updatePluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: 'Edition',
            data: {
              number: form.values.number
            },
          }),
        });
      }

      const res = await tx.sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Edition complete', sig);
      notifications.show({ title: 'Edition complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Edition failed', error);
      notifications.show({ title: 'Edition failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.number, asset]);
  return (
    <Stack gap="xs">
        <NumberInput
          value={form.values.number}
          defaultValue=""
          {...form.getInputProps(`number`)}

        />

      <Button
        placeholder="Wallet address"
        {...form.getInputProps('destination')}
        loading={loading}
        disabled={!form.isValid()}
        onClick={handleAttributes}
      >Update edition
      </Button>
    </Stack>
  );
}
