import { Center, Image, Loader, Stack, Text, Title } from '@mantine/core';
import { useAssetJson } from '../../hooks/asset';
import { ExplorerStat } from '../Explorer/ExplorerStat';
import { AssetWithCollection } from '@/lib/type';

export function AutographAssetDetails({ asset }: AssetWithCollection) {
  const jsonInfo = useAssetJson(asset);

  return (
    <Stack>
      <Text fz="md" tt="uppercase" fw={700} c="dimmed">
        Asset Details
      </Text>
      <Title>{jsonInfo?.data?.name || asset.name}</Title>

      {jsonInfo.isPending ? <Center h="20vh"><Loader /></Center> :
        <>

          {jsonInfo.data?.image && <Image src={jsonInfo.data.image} maw={320} />}
          {jsonInfo.data?.description && <ExplorerStat
            label="Description"
            value={jsonInfo.data?.description}
          />}
        </>
      }
      {asset.updateAuthority.type === 'Collection' && (
        <ExplorerStat
          label="Collection"
          value={asset.updateAuthority.address || ''}
          copyable
          asNativeLink={`/explorer/collection/${asset.updateAuthority.address}`}
        />
      )}
    </Stack>
  );
}
