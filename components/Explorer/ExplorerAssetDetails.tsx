import { Center, Image, Loader, Stack, Text, Title } from '@mantine/core';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { AssetV1 } from 'core-preview';
import { useAssetJson } from '../../hooks/asset';
import { ExplorerStat } from './ExplorerStat';
import RetainQueryLink from '../RetainQueryLink';

export function ExplorerAssetDetails({ asset }: { asset: AssetV1 }) {
  const jsonInfo = useAssetJson(asset);
  return (
    <Stack>
      <Text fz="md" tt="uppercase" fw={700} c="dimmed">Asset Details</Text>
      <Title>{jsonInfo?.data?.name || asset.name}</Title>

      {jsonInfo.isPending ? <Center h="20vh"><Loader /></Center> :
        <>

          <Image src={jsonInfo.data.image} maw={320} />
          {jsonInfo.data.description && <ExplorerStat
            label="Description"
            value={jsonInfo.data.description}
          />}
        </>
      }
      <ExplorerStat
        label="Mint"
        value={asset.publicKey}
        copyable
      />
      <ExplorerStat
        label="Owner"
        value={asset.owner}
        copyable
      />
      <ExplorerStat
        label="Update Authority Type"
        value={asset.updateAuthority.type}
        labeled
      />

      {asset.updateAuthority.type === 'Collection' && (
        <RetainQueryLink
          href={`/explorer/collection/${asset.updateAuthority.address}`}
          style={{
            textDecoration: 'none',
          }}
        >
          <ExplorerStat
            label="Collection"
            value={asset.updateAuthority.address || ''}
            copyable
          />
        </RetainQueryLink>
      )}
      {jsonInfo.data && (
        <>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">JSON Metadata</Text>
          <CodeHighlightTabs
            withExpandButton
            expandCodeLabel="Show full JSON"
            collapseCodeLabel="Show less"
            defaultExpanded={false}
            mb="lg"
            code={[{
              fileName: 'metadata.json',
              language: 'json',
              code: JSON.stringify(jsonInfo.data, null, 2),
            }]}
          />
        </>)}

    </Stack>
  );
}
