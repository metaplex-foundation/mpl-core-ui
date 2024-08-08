import { Button, CloseButton, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { none, TransactionBuilder, transactionBuilder } from '@metaplex-foundation/umi';
import {
  createPlugin,
  CollectionV1,
  addCollectionPluginV1,
  updateCollectionPluginV1,
} from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { useInvalidateFetchCollectionsByUpdateAuthority } from '@/hooks/fetch';

export function MasterEdition({ collection }: { collection: CollectionV1 }) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchCollectionsByUpdateAuthority();
  const form = useForm({
    initialValues: {
      maxSupply: collection.masterEdition?.maxSupply,
      name: collection.masterEdition?.name,
      uri: collection.masterEdition?.uri,
    },
    validateInputOnBlur: true,
    validate: {},
  });
  console.log("MasterEdition")
  const handleMasterEdition = useCallback(async () => {
    try {
      setLoading(true);
      let tx: TransactionBuilder = transactionBuilder();

      if (!collection.masterEdition) {
        tx = addCollectionPluginV1(umi, {
          collection: collection.publicKey,
          plugin: createPlugin({
            type: 'MasterEdition',
            data: {
              maxSupply: form.values.maxSupply || none(),
              name: form.values.name || none(),
              uri: form.values.uri || none(),
            },
          }),
        });
      } else {
        tx = updateCollectionPluginV1(umi, {
          collection: collection.publicKey,
          plugin: createPlugin({
            type: 'MasterEdition',
            data: {
              maxSupply: form.values.maxSupply || none(),
              name: form.values.name || none(),
              uri: form.values.uri || none(),
            },
          }),
        });
      }

      const res = await tx.sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('MasterEdition complete', sig);
      notifications.show({ title: 'MasterEdition complete', message: sig, color: 'green' });
      invalidate(collection.publicKey);
    } catch (error: any) {
      console.error('MasterEdition failed', error);
      notifications.show({ title: 'MasterEdition failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values, collection]);
  return (
    <Stack gap="xs">
      <Group>
        <NumberInput
          value={form.values.maxSupply}
          defaultValue=""
          {...form.getInputProps(`maxSupply`)}

        />
        <TextInput value={form.values.name} defaultValue="" {...form.getInputProps(`name`)}/>
        <TextInput value={form.values.uri} defaultValue="" {...form.getInputProps(`uri`)}/>
      </Group>

      <Button
        placeholder="Wallet address"
        {...form.getInputProps('destination')}
        loading={loading}
        disabled={!form.isValid()}
        onClick={handleMasterEdition}
      >
        Update Master Edition
      </Button>
    </Stack>
  );
}
