import { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { CollectionV1, updateCollectionV1 } from '@metaplex-foundation/mpl-core';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { Button, Stack, TextInput } from '@mantine/core';
import { useUmi } from '@/providers/useUmi';
import { useInvalidateFetchCollectionsByUpdateAuthority } from '@/hooks/fetch';
import { validateUri } from '@/lib/form';

export function Update({ collection }: { collection: CollectionV1 }) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchCollectionsByUpdateAuthority();
  const form = useForm({
    initialValues: {
      name: collection.name,
      uri: collection.uri,
      updateAuth: collection.updateAuthority,
    },
    validateInputOnBlur: true,
    validate: {
      uri: (value) => validateUri(value) ? null : 'Invalid URI',
      updateAuth: (value) => validateUri(value) ? null : 'Invalid URI',
    },
  });

  const handleUpdate = useCallback(async () => {
    try {
      setLoading(true);
      const res = await updateCollectionV1(umi, {
        collection: collection.publicKey,
        newName: form.values.name,
        newUri: form.values.uri,
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Update complete', sig);
      notifications.show({ title: 'Update complete', message: sig, color: 'green' });
      invalidate(umi.identity.publicKey);
    } catch (error: any) {
      console.error('Update failed', error);
      notifications.show({ title: 'Update failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.name, form.values.uri, collection]);
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
      <TextInput
        label="Update authority"
        {...form.getInputProps('updateAuth')}
      />
      <Button onClick={handleUpdate} loading={loading}>Update</Button>
    </Stack>
  );
}
