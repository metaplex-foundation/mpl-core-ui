import { ActionIcon, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { publicKey } from '@metaplex-foundation/umi';
import { collectionAddress, transferV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { IconSend } from '@tabler/icons-react';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { validatePubkey } from '@/lib/form';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function Transfer({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const form = useForm({
    initialValues: {
      destination: '',
    },
    validateInputOnBlur: true,
    validate: {
      destination: (value) => validatePubkey(value) ? null : 'Invalid public key',
    },
  });

  const handleTransfer = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transferV1(umi, {
        asset: asset.publicKey,
        newOwner: publicKey(form.values.destination),
        collection: collectionAddress(asset),
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Transfer complete', sig);
      notifications.show({ title: 'Transfer complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Transfer failed', error);
      notifications.show({ title: 'Transfer failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.destination, asset]);
  return (
    <TextInput
      label="Transfer destination"
      description="Use transfer delegate to transfer the asset"
      placeholder="Wallet address"
      {...form.getInputProps('destination')}
      rightSection={<ActionIcon onClick={handleTransfer} disabled={!form.isValid()} loading={loading}><IconSend /></ActionIcon>}
    />
  );
}
