import { ActionIcon, Center, Group, Image, Loader, Modal, Stack, Text, Title } from '@mantine/core';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAssetJson } from '../../hooks/asset';
import { ExplorerStat } from './ExplorerStat';
import { ManageCollectionForm } from './ManageCollectionForm/ManageCollectionForm';

export function ExplorerCollectionDetails({ collection }: { collection: CollectionV1 }) {
  const { connected } = useWallet();
  const jsonInfo = useAssetJson(collection);
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Stack>
      <Group justify="space-between">
        <Text fz="md" tt="uppercase" fw={700} c="dimmed">Collection Details</Text>
        <ActionIcon
          variant="subtle"
          color="rgba(145, 145, 145, 1)"
          disabled={!connected}
          onClick={() => {
            open();
          }}
        ><IconSettings />
        </ActionIcon>
      </Group>
      {jsonInfo.isPending ? <Center h="20vh"><Loader /></Center> :
        <>
          <Title>{jsonInfo.data.name}</Title>

          <Image src={jsonInfo.data.image} maw={320} />
          {jsonInfo.data.description && <ExplorerStat
            label="Description"
            value={jsonInfo.data.description}
          />}
          <ExplorerStat
            label="Mint"
            value={collection.publicKey}
            copyable
          />
          <ExplorerStat
            label="Update authority"
            value={collection.updateAuthority}
            copyable
          />

          <ExplorerStat
            label="Metadata URI"
            value={collection.uri}
            copyable
            asExternalLink={collection.uri}
          />

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
        </>}
      <Modal opened={opened} onClose={close} centered title="Advanced collection settings" size="70%">
        <ManageCollectionForm
          collection={collection}
        />
      </Modal>
    </Stack>
  );
}
