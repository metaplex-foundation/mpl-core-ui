import { useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { update, fetchCollectionV1, baseUpdateAuthority } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { Button, Stack, TextInput } from '@mantine/core';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';
import { validatePubkey } from '@/lib/form';

export function AddToCollection({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const form = useForm({
    initialValues: {
      collectionAddress: '',
    },
    validateInputOnBlur: true,
    validate: {
      collectionAddress: (value) => validatePubkey(value) ? null : 'Invalid collection address',
    },
  });

  const handleAddToCollection = useCallback(async () => {
    try {
      setLoading(true);
      const collectionPubkey = publicKey(form.values.collectionAddress);
      const collection = await fetchCollectionV1(umi, collectionPubkey);

      const res = await update(umi, {
        asset,
        newCollection: collection.publicKey,
        newUpdateAuthority: baseUpdateAuthority('Collection', [collection.publicKey]),
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Added to collection', sig);
      notifications.show({ title: 'Added to collection', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Add to collection failed', error);
      notifications.show({ title: 'Add to collection failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.collectionAddress, asset]);

  return (
    <Stack gap="xs">
      <TextInput
        label="Collection address"
        placeholder="Enter the collection public key"
        {...form.getInputProps('collectionAddress')}
      />
      <Button onClick={handleAddToCollection} loading={loading} disabled={!form.isValid()}>
        Add to Collection
      </Button>
    </Stack>
  );
}
