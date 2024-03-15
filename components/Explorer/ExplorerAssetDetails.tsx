import { Center, Image, Loader, Stack, Text, Title } from '@mantine/core';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { Asset } from '@metaplex-foundation/mpl-core';
import { useAssetJson } from '../Create/hooks';
import { ExplorerStat } from './ExplorerStat';
import RetainQueryLink from '../RetainQueryLink';

export function ExplorerAssetDetails({ asset }: { asset: Asset }) {
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
        value={asset.updateAuthority.__kind}
        labeled
      />

      {asset.updateAuthority.__kind === 'Collection' && (
        <RetainQueryLink
          href={`/explorer/collection/${asset.updateAuthority.fields[0]}`}
          style={{
            textDecoration: 'none',
          }}
        >
          <ExplorerStat
            label="Collection"
            value={asset.updateAuthority.fields[0]}
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
