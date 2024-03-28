import { ActionIcon, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TransactionBuilder, publicKey, transactionBuilder } from '@metaplex-foundation/umi';
import { addPluginV1, approvePluginAuthorityV1, createPlugin, addressPluginAuthority, collectionAddress, AssetPluginKey } from '@metaplex-foundation/mpl-core';
import { useCallback, useMemo, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { IconSettingsShare } from '@tabler/icons-react';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { validatePubkey } from '@/lib/form';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';
import { pluginTypeFromAssetPluginKey, typeToLabel } from '@/lib/plugin';
import { capitalizeFirstLetter } from '@/lib/string';

export function Approve({ asset, type, create, pluginArgs }: AssetWithCollection & { type: AssetPluginKey, create?: boolean, pluginArgs?: any }) {
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
  const typeLabel = useMemo(() => typeToLabel(type), [type]);

  const handleApprove = useCallback(async () => {
    try {
      setLoading(true);
      let tx: TransactionBuilder = transactionBuilder();
      const pluginType = capitalizeFirstLetter(type) as any;

      if (create) {
        tx = addPluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: pluginType,
            data: pluginArgs,
          }),
        });
      }

      tx = tx.add(approvePluginAuthorityV1(umi, {
        asset: asset.publicKey,
        collection: collectionAddress(asset),
        pluginType: pluginTypeFromAssetPluginKey(type),
        newAuthority: addressPluginAuthority(publicKey(form.values.destination)),
      }));

      const res = await tx.sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Approve complete', sig);
      notifications.show({ title: 'Approve complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Approve failed', error);
      notifications.show({ title: 'Approve failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.destination, asset]);
  return (

      <TextInput
        description={`This delegate can manage ${typeLabel} on your asset on your behalf`}
        placeholder="Wallet address"
        {...form.getInputProps('destination')}
        rightSection={<ActionIcon onClick={handleApprove} disabled={!form.isValid()} loading={loading}><IconSettingsShare /></ActionIcon>}
      />

  );
}
