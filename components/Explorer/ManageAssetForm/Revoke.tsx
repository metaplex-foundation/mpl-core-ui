import { ActionIcon, TextInput } from '@mantine/core';
import { AssetPluginKey, collectionAddress, revokePluginAuthorityV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useMemo, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { IconSettingsCancel } from '@tabler/icons-react';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';
import { pluginTypeFromAssetPluginKey, typeToLabel } from '@/lib/plugin';

export function Revoke({ asset, type }: AssetWithCollection & { type: AssetPluginKey }) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const typeLabel = useMemo(() => typeToLabel(type), [type]);
  const delegate = useMemo(() => {
    switch (asset[type]?.authority?.type) {
      case 'Address':
        return asset[type]?.authority?.address;
      case 'UpdateAuthority':
        return 'Update Authority';
      case 'Owner':
        return 'Owner';
      case 'None':
      default:
        return 'None';
    }
  }, [asset, type]);

  const handleRevoke = useCallback(async () => {
    try {
      setLoading(true);
      const res = await revokePluginAuthorityV1(umi, {
        asset: asset.publicKey,
        collection: collectionAddress(asset),
        pluginType: pluginTypeFromAssetPluginKey(type),
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Revoke complete', sig);
      notifications.show({ title: 'Revoke complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Revoke failed', error);
      notifications.show({ title: 'Revoke failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, asset]);
  return (

      <TextInput
        description={`This delegate can manage ${typeLabel} on your asset on your behalf`}
        value={delegate}
        disabled
        rightSection={<ActionIcon onClick={handleRevoke} loading={loading} color="red"><IconSettingsCancel /></ActionIcon>}
      />

  );
}
