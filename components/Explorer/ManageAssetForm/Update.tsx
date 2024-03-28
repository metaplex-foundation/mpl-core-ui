import { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { collectionAddress, updateV1 } from '@metaplex-foundation/mpl-core';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { Button, Stack, TextInput } from '@mantine/core';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';
import { validateUri } from '@/lib/form';

export function Update({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const form = useForm({
    initialValues: {
      name: asset.name,
      uri: asset.uri,
    },
    validateInputOnBlur: true,
    validate: {
      uri: (value) => validateUri(value) ? null : 'Invalid URI',
    },
  });

  const handleUpdate = useCallback(async () => {
    try {
      setLoading(true);
      const res = await updateV1(umi, {
        asset: asset.publicKey,
        newName: form.values.name,
        newUri: form.values.uri,
        collection: collectionAddress(asset),
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Update complete', sig);
      notifications.show({ title: 'Update complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Update failed', error);
      notifications.show({ title: 'Update failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.name, form.values.uri, asset]);
  return (
    <Stack gap="xs">
      <TextInput
        label="Name"
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Uri"
        {...form.getInputProps('uri')}
      />
      <Button onClick={handleUpdate} loading={loading}>Update</Button>
    </Stack>
  );
}
