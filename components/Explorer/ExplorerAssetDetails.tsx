import { ActionIcon, Anchor, Button, Center, Group, Image, Loader, Modal, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { IconExternalLink, IconRobot, IconSettings } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { canTransfer } from '@metaplex-foundation/mpl-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAssetJson } from '../../hooks/asset';
import { ExplorerStat } from './ExplorerStat';
import { useUmi } from '@/providers/useUmi';
import { useEnv } from '@/providers/useEnv';
import { TransferForm } from './TransferForm';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';
import { ManageAssetForm } from './ManageAssetForm/ManageAssetForm';
import { AssetWithCollection } from '@/lib/type';

export function ExplorerAssetDetails({ asset, collection }: AssetWithCollection) {
  const umi = useUmi();
  const env = useEnv();
  const { connected } = useWallet();
  const jsonInfo = useAssetJson(asset);
  const [opened, { open, close }] = useDisclosure(false);
  const [actionMode, setActionMode] = useState<'transfer' | 'advanced'>('transfer');
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const hasAgentIdentity = asset.agentIdentities && asset.agentIdentities.length > 0;

  const isOwner = useMemo(() => asset.owner === umi.identity.publicKey, [umi.identity.publicKey, asset]);
  const enableTransfer = useMemo(() => canTransfer(umi.identity.publicKey, asset, collection), [umi.identity.publicKey, asset, collection]);

  return (
    <Stack>
      <Group justify="space-between">
        <Text fz="md" tt="uppercase" fw={700} c="dimmed">Asset Details</Text>
        <Group>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              disabled={!enableTransfer || !connected}
              onClick={() => {
                setActionMode('transfer');
                open();
              }}
            >Transfer
            </Button>)}
          <ActionIcon
            variant="subtle"
            color="rgba(145, 145, 145, 1)"
            disabled={!connected}
            onClick={() => {
              setActionMode('advanced');
              open();
            }}
          ><IconSettings />
          </ActionIcon>
        </Group>
      </Group>
      <Title>{jsonInfo?.data?.name || asset.name}</Title>

      {hasAgentIdentity && (
        <Anchor
          href={`https://www.metaplex.com/agents/${asset.publicKey}${env === 'devnet' ? '?network=solana-devnet' : ''}`}
          target="_blank"
          underline="never"
        >
          <Paper p="md" radius="md" withBorder style={{ borderColor: 'var(--mantine-color-violet-6)' }}>
            <Group>
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'violet', to: 'grape' }}>
                <IconRobot size={20} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text fw={600} size="sm">Agent Identity</Text>
                <Text size="xs" c="dimmed">View this agent on Metaplex</Text>
              </div>
              <IconExternalLink size={16} color="var(--mantine-color-dimmed)" />
            </Group>
          </Paper>
        </Anchor>
      )}

      {jsonInfo.isPending ? <Center h="20vh"><Loader /></Center> :
        <>

          {jsonInfo.data?.image && <Image src={jsonInfo.data.image} maw={320} />}
          {jsonInfo.data?.description && <ExplorerStat
            label="Description"
            value={jsonInfo.data?.description}
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
      {asset.updateAuthority.type === 'Address' && (
        <ExplorerStat
          label="Update Authority"
          value={asset.updateAuthority.address || ''}
          copyable
        />
      )}

      {asset.updateAuthority.type === 'Collection' && (
        <ExplorerStat
          label="Collection"
          value={asset.updateAuthority.address || ''}
          copyable
          asNativeLink={`/explorer/collection/${asset.updateAuthority.address}`}
        />
      )}

      <ExplorerStat
        label="Metadata URI"
        value={asset.uri}
        copyable
        asExternalLink={asset.uri}
      />
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
      <Modal opened={opened} onClose={close} centered title={actionMode === 'transfer' ? 'Transfer asset' : 'Advanced asset settings'} size={actionMode === 'advanced' ? '70%' : 'md'}>
        {actionMode === 'transfer' ? (
          <TransferForm
            asset={asset}
            onComplete={() => {
              invalidate(asset.publicKey);
              close();
            }}
          />) : (
          <ManageAssetForm
            asset={asset}
            collection={collection}
          />
        )}
      </Modal>
    </Stack>
  );
}
