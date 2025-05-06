import { Badge, Fieldset, Flex, Group, Stack, Text } from '@mantine/core';
import { ExternalPluginAdaptersList, PluginAuthority, PluginsList } from '@metaplex-foundation/mpl-core';
import { ExplorerStat } from './ExplorerStat';
import { CopyButton } from '../CopyButton/CopyButton';
import { LabelTitle } from '../LabelTitle';
import { capitalizeFirstLetter } from '@/lib/string';

const AuthorityStat = ({ authority, name }: { authority: PluginAuthority, name: string }) => {
  switch (authority.type) {
    case 'None':
    case 'Owner':
    case 'UpdateAuthority':
      return <ExplorerStat label={`${name} Authority`} value={authority.type} labeled />;
    case 'Address':
    default:
      return authority.address && <ExplorerStat label={`${name} Authority`} value={authority.address} />;
  }
};

export function ExplorerPluginDetails({ plugins, type }: { plugins: PluginsList & ExternalPluginAdaptersList, type: 'asset' | 'collection' }) {
  console.log(plugins);
  return (
    <Stack>
      <LabelTitle fz="md">{type === 'asset' ? 'Asset' : 'Collection'} Plugin Details</LabelTitle>
      {plugins.edition && (
        <>
          <ExplorerStat label="Edition Number" value={plugins.edition.number.toString()} />
          <AuthorityStat authority={plugins.edition.authority} name="Edition" />
        </>
      )}
      <ExplorerStat label="Frozen" value={(plugins.freezeDelegate?.frozen || plugins.permanentFreezeDelegate?.frozen) ? 'Yes' : 'No'} />
      {plugins.freezeDelegate && <AuthorityStat authority={plugins.freezeDelegate.authority} name="Freeze" />}
      {plugins.burnDelegate && <AuthorityStat authority={plugins.burnDelegate.authority} name="Burn" />}
      {plugins.transferDelegate && <AuthorityStat authority={plugins.transferDelegate.authority} name="Transfer" />}
      {plugins.permanentFreezeDelegate && <AuthorityStat authority={plugins.permanentFreezeDelegate.authority} name="Permanent Freeze" />}
      {plugins.updateDelegate && <AuthorityStat authority={plugins.updateDelegate.authority} name="Update Delegate" />}
      {plugins.royalties && (
        <>
          <ExplorerStat label="Royalties" value={`${plugins.royalties.basisPoints / 100}%`} />
          <AuthorityStat authority={plugins.royalties.authority} name="Royalties" />
          <div>
            <LabelTitle>Creator Shares</LabelTitle>
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
      <ExplorerStat label="Immutable Metadata" value={plugins.immutableMetadata ? 'Yes' : 'No'} />
      {plugins.immutableMetadata && <AuthorityStat authority={plugins.immutableMetadata.authority} name="Immutable Metadata" />}

      {plugins.attributes && (
        <>
          <AuthorityStat authority={plugins.attributes.authority} name="Attributes" />
          <div>
            <LabelTitle>Attributes</LabelTitle>
            {plugins.attributes.attributeList.map((attr, idx) => <Text key={idx}>{`${attr.key}: ${attr.value}`}</Text>)}
          </div>
        </>
      )}

      {plugins.appDatas && plugins.appDatas.map((appData, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>App Data</LabelTitle>}>
          <Stack>
            <AuthorityStat authority={appData.authority} name="Plugin" />
            <AuthorityStat authority={appData.dataAuthority} name="Data" />
            <div>
              <LabelTitle>Raw Bytes</LabelTitle>
              <Text fz="sm" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {appData.data instanceof Uint8Array
                  ? Array.from(appData.data)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(' ')
                  : appData.data}
              </Text>
            </div>
          </Stack>
        </Fieldset>
      ))}

      {plugins.linkedAppDatas && plugins.linkedAppDatas.map((linkedAppData, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>Linked App Data</LabelTitle>}>
          <Stack>
            <AuthorityStat authority={linkedAppData.authority} name="Plugin" />
            <AuthorityStat authority={linkedAppData.dataAuthority} name="Data" />
          </Stack>
        </Fieldset>
      ))}

      {plugins.dataSections && plugins.dataSections.map((dataSection, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>Data Section</LabelTitle>}>
          <Stack>
            <ExplorerStat label="Parent Type" value={dataSection.parentKey.type} />
            {dataSection.parentKey.type === 'LinkedAppData' && <AuthorityStat authority={dataSection.dataAuthority!} name="Data" />}
            <div>
              <LabelTitle>Raw Bytes</LabelTitle>
              <Text fz="sm" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {dataSection.data instanceof Uint8Array
                  ? Array.from(dataSection.data)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join(' ')
                  : dataSection.data}
              </Text>
            </div>
          </Stack>
        </Fieldset>
      ))}

      {plugins.oracles && plugins.oracles.map((oracle, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>{`Oracle ${idx + 1}`}</LabelTitle>}>
          <Stack>
            <ExplorerStat label="Base Address" value={oracle.baseAddress} copyable />
            <AuthorityStat authority={oracle.authority} name="" />
            <div>
              <LabelTitle>Lifecycles</LabelTitle>
              {oracle.lifecycleChecks && Object.keys(oracle.lifecycleChecks).map((key) => <Badge size="sm" variant="outline">{capitalizeFirstLetter(key)}</Badge>)}
            </div>
            <ExplorerStat label="Results offset" value={oracle.resultsOffset.type === 'Custom' ? oracle.resultsOffset.offset.toString() : oracle.resultsOffset.type} />
            {oracle.baseAddressConfig && (
              <div>
                <LabelTitle>Oracle account derivation</LabelTitle>
                {oracle.baseAddressConfig.type === 'Address' ? <Text fz="sm">{oracle.baseAddressConfig.address}</Text> :
                  oracle.baseAddressConfig.type === 'CustomPda' ? (
                    <Flex gap="sm">
                      {oracle.baseAddressConfig.seeds.map((seed, i) => {
                        if (seed.type === 'Address') {
                          return <Badge key={i} size="sm" variant="default">{seed.pubkey}</Badge>;
                        }
                        if (seed.type === 'Bytes') {
                          return <Badge key={i} size="sm" variant="outline">{seed.bytes.toString()}</Badge>;
                        }
                        return <Badge key={i} size="sm" variant="outline">{seed.type}</Badge>;
                      })}
                    </Flex>
                  ) : <Badge size="sm" variant="outline">{oracle.baseAddressConfig.type}</Badge>}

              </div>

            )}
          </Stack>
        </Fieldset>
      ))}
      {plugins.masterEdition && (
        <>
          <div>
            <AuthorityStat authority={plugins.masterEdition.authority} name="Master Edition" />
            {plugins.masterEdition.name && <ExplorerStat label="Master Edition Name" value={plugins.masterEdition.name} />}
            {plugins.masterEdition.maxSupply && plugins.masterEdition.maxSupply > 0 && <ExplorerStat label="Master Edition May Supply" value={plugins.masterEdition.maxSupply.toString()} />}
            {plugins.masterEdition.uri && <ExplorerStat label="Master Edition URI" value={plugins.masterEdition.uri} />}
          </div>
        </>
      )}

    </Stack>
  );
}
