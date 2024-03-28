import { ActionIcon, TextInput } from '@mantine/core';
import { AssetPluginKey, CollectionV1, revokeCollectionPluginAuthorityV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useMemo, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { IconSettingsCancel } from '@tabler/icons-react';
import { useUmi } from '@/providers/useUmi';
import { useInvalidateFetchCollectionsByUpdateAuthority } from '@/hooks/fetch';
import { pluginTypeFromAssetPluginKey, typeToLabel } from '@/lib/plugin';

export function Revoke({ collection, type }: { collection: CollectionV1, type: AssetPluginKey }) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchCollectionsByUpdateAuthority();
  const typeLabel = useMemo(() => typeToLabel(type), [type]);
  const delegate = useMemo(() => {
    switch (collection[type]?.authority?.type) {
      case 'Address':
        return collection[type]?.authority?.address;
      case 'UpdateAuthority':
        return 'Update Authority';
      case 'Owner':
        return 'Owner';
      case 'None':
      default:
        return 'None';
    }
  }, [collection, type]);

  const handleRevoke = useCallback(async () => {
    try {
      setLoading(true);
      const res = await revokeCollectionPluginAuthorityV1(umi, {
        collection: collection.publicKey,
        pluginType: pluginTypeFromAssetPluginKey(type),
      }).sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Revoke complete', sig);
      notifications.show({ title: 'Revoke complete', message: sig, color: 'green' });
      invalidate(umi.identity.publicKey);
    } catch (error: any) {
      console.error('Revoke failed', error);
      notifications.show({ title: 'Revoke failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, collection]);
  return (

      <TextInput
        description={`This delegate can manage ${typeLabel} on your collection on your behalf`}
        value={delegate}
        disabled
        rightSection={<ActionIcon onClick={handleRevoke} loading={loading} color="red"><IconSettingsCancel /></ActionIcon>}
      />

  );
}
