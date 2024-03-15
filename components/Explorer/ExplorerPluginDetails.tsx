import { Badge, Group, Stack, Text } from '@mantine/core';
import { BaseAuthority, PluginsList } from '@metaplex-foundation/mpl-core';
import { ExplorerStat } from './ExplorerStat';
import { CopyButton } from '../CopyButton/CopyButton';

const AuthorityStat = ({ authority, name }: { authority: BaseAuthority, name: string }) => {
  switch (authority.type) {
    case 'None':
    case 'Owner':
    case 'UpdateAuthority':
      return <ExplorerStat label={`${name} Authority`} value={authority.type} labeled />;
    case 'Pubkey':
    default:
      return authority.address && <ExplorerStat label={`${name} Authority`} value={authority.address} />;
  }
};

export function ExplorerPluginDetails({ plugins, type }: { plugins: PluginsList, type: 'asset' | 'collection' }) {
  return (
    <Stack>
      <Text fz="md" tt="uppercase" fw={700} c="dimmed">{type === 'asset' ? 'Asset' : 'Collection'} Plugin Details</Text>
      <ExplorerStat label="Frozen" value={(plugins.freeze?.frozen || plugins.permanentFreeze?.frozen) ? 'Yes' : 'No'} />
      {plugins.freeze && <AuthorityStat authority={plugins.freeze.authority} name="Freeze" />}
      {plugins.burn && <AuthorityStat authority={plugins.burn.authority} name="Burn" />}
      {plugins.transfer && <AuthorityStat authority={plugins.transfer.authority} name="Transfer" />}
      {plugins.permanentFreeze && <AuthorityStat authority={plugins.permanentFreeze.authority} name="Permanent Freeze" />}
      {plugins.updateDelegate && <AuthorityStat authority={plugins.updateDelegate.authority} name="Update Delegate" />}
      {plugins.royalties && (
        <>
          <ExplorerStat label="Royalties" value={`${plugins.royalties.basisPoints / 100}%`} />
          <AuthorityStat authority={plugins.royalties.authority} name="Royalties" />
          <div>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">Creator Shares</Text>
            {plugins.royalties.creators.map((creator, idx) => (
              <Group key={idx}>
                <Badge size="sm" variant="outline">{creator.percentage}%</Badge>
                <Text fz="sm">{creator.address}</Text>
                <CopyButton value={creator.address} />
              </Group>
            ))}
          </div>
        </>
      )}
      {plugins.attributes && (
        <>
          <AuthorityStat authority={plugins.attributes.authority} name="Attributes" />
          <div>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">Attributes</Text>
            {plugins.attributes.attributeList.map((attr, idx) => <Text key={idx}>{`${attr.key}: ${attr.value}`}</Text>)}
          </div>
        </>
      )}

    </Stack>
  );
}
