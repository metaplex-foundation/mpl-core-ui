import { Badge, Button, Collapse, Fieldset, Flex, Group, Stack, Text } from '@mantine/core';
import { ExternalPluginAdaptersList, ExternalPluginAdapterSchema, PluginAuthority, PluginsList } from '@metaplex-foundation/mpl-core';
import { useState } from 'react';
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
      return authority.address && <ExplorerStat label={`${name} Authority`} value={authority.address} copyable />;
  }
};

// Helper function to get schema label
const getSchemaLabel = (schema?: ExternalPluginAdapterSchema): string => {
  if (schema === undefined || schema === null) return 'Unknown';
  switch (schema) {
    case ExternalPluginAdapterSchema.Binary:
      return 'Binary';
    case ExternalPluginAdapterSchema.Json:
      return 'JSON';
    case ExternalPluginAdapterSchema.MsgPack:
      return 'MsgPack';
    default:
      return 'Unknown';
  }
};

// Helper function to format data based on schema
const formatDataBySchema = (data: any, schema?: ExternalPluginAdapterSchema): string => {
  if (!data) return 'No data';

  try {
    if (schema === ExternalPluginAdapterSchema.MsgPack || schema === ExternalPluginAdapterSchema.Json) {
      return JSON.stringify(data, null, 2);
    }

    // For binary/msgpack or unknown schema, display as hex
    if (data instanceof Uint8Array) {
      return Array.from(data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
    }

    // Fallback to string representation
    return typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
  } catch (error) {
    return 'Error formatting data';
  }
};

// Collapsible data display component
const CollapsibleDataDisplay = ({
  data,
  schema,
  title = 'Data',
}: {
  data: any;
  schema?: ExternalPluginAdapterSchema;
  title?: string;
}) => {
  const [opened, setOpened] = useState(false);

  if (!data) return null;

  const formattedData = formatDataBySchema(data, schema);

  return (
    <div>
      <Group justify="space-between" mb="xs">
        <LabelTitle>{title}</LabelTitle>
        <Button
          size="xs"
          variant="subtle"
          onClick={() => setOpened(!opened)}
        >
          {opened ? 'Hide' : 'Show'} Data
        </Button>
      </Group>
      <Collapse in={opened}>
        <Text
          fz="sm"
          style={{
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#202020',
            padding: '8px',
            borderRadius: '4px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {formattedData}
        </Text>
      </Collapse>
    </div>
  );
};

export function ExplorerPluginDetails({ plugins, type }: { plugins: PluginsList & ExternalPluginAdaptersList, type: 'asset' | 'collection' }) {
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
      {plugins.updateDelegate && <AuthorityStat authority={plugins.updateDelegate.authority} name="Update Delegate" />}
      {plugins.permanentFreezeDelegate && <AuthorityStat authority={plugins.permanentFreezeDelegate.authority} name="Permanent Freeze" />}
      {plugins.permanentTransferDelegate && <AuthorityStat authority={plugins.permanentTransferDelegate.authority} name="Permanent Transfer" />}
      {plugins.permanentBurnDelegate && <AuthorityStat authority={plugins.permanentBurnDelegate.authority} name="Permanent Burn" />}
      {plugins.addBlocker && <AuthorityStat authority={plugins.addBlocker.authority} name="Add Blocker" />}

      {plugins.verifiedCreators && (
        <>
          <AuthorityStat authority={plugins.verifiedCreators.authority} name="Verified Creators" />
          <div>
            <LabelTitle>Verified Creators</LabelTitle>
            {plugins.verifiedCreators.signatures.map((creator, idx) => (
              <Group key={idx}>
                <Badge size="sm" variant={creator.verified ? 'filled' : 'outline'}>{creator.verified ? 'Verified' : 'Unverified'}</Badge>
                <Text fz="sm">{creator.address}</Text>
                <CopyButton value={creator.address} />
              </Group>
            ))}
          </div>
        </>
      )}

      {plugins.autograph && (
        <>
          <AuthorityStat authority={plugins.autograph.authority} name="Autograph" />
          <div>
            <LabelTitle>Autograph Signatures</LabelTitle>
            {plugins.autograph.signatures.map((signature, idx) => (
              <Stack key={idx} gap="xs">
                <Group>
                  <Text fz="sm" fw={500}>Signer:</Text>
                  <Text fz="sm">{signature.address}</Text>
                  <CopyButton value={signature.address} />
                </Group>
                {signature.message && (
                  <Group>
                    <Text fz="sm" fw={500}>Message:</Text>
                    <Text fz="sm">{signature.message}</Text>
                  </Group>
                )}
              </Stack>
            ))}
          </div>
        </>
      )}

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

      {plugins.appDatas?.map((appData, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>{`App Data ${idx + 1}`}</LabelTitle>}>
          <Stack>
            <AuthorityStat authority={appData.authority} name="Plugin" />
            <AuthorityStat authority={appData.dataAuthority} name="Data" />
            <ExplorerStat
              label="Schema"
              value={getSchemaLabel(appData.schema)}
            />
            <CollapsibleDataDisplay
              data={appData.data}
              schema={appData.schema}
              title="Stored Data"
            />
          </Stack>
        </Fieldset>
      ))}

      {plugins.linkedAppDatas?.map((linkedAppData, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>{`Linked App Data ${idx + 1}`}</LabelTitle>}>
          <Stack>
            <AuthorityStat authority={linkedAppData.authority} name="Plugin" />
            <AuthorityStat authority={linkedAppData.dataAuthority} name="Data" />
            <ExplorerStat
              label="Schema"
              value={getSchemaLabel(linkedAppData.schema)}
            />
            <CollapsibleDataDisplay
              data={linkedAppData.data}
              schema={linkedAppData.schema}
              title="Stored Data"
            />
          </Stack>
        </Fieldset>
      ))}

      {plugins.dataSections?.map((dataSection, idx) => (
        <Fieldset key={idx} legend={<LabelTitle>{`Data Section ${idx + 1}`}</LabelTitle>}>
          <Stack>
            <ExplorerStat label="Parent Type" value={dataSection.parentKey.type} />
            {dataSection.parentKey.type === 'LinkedAppData' && dataSection.dataAuthority && (
              <AuthorityStat authority={dataSection.dataAuthority} name="Data" />
            )}
            <ExplorerStat
              label="Schema"
              value={getSchemaLabel(dataSection.schema)}
            />
            <CollapsibleDataDisplay
              data={dataSection.data}
              schema={dataSection.schema}
              title="Stored Data"
            />
          </Stack>
        </Fieldset>
      ))}

      {
        plugins.oracles && plugins.oracles.map((oracle, idx) => (
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
        ))
      }
      {
        plugins.masterEdition && (
          <>
            <div>
              <AuthorityStat authority={plugins.masterEdition.authority} name="Master Edition" />
              {plugins.masterEdition.name && <ExplorerStat label="Master Edition Name" value={plugins.masterEdition.name} />}
              {plugins.masterEdition.maxSupply && plugins.masterEdition.maxSupply > 0 && <ExplorerStat label="Master Edition May Supply" value={plugins.masterEdition.maxSupply.toString()} />}
              {plugins.masterEdition.uri && <ExplorerStat label="Master Edition URI" value={plugins.masterEdition.uri} />}
            </div>
          </>
        )
      }

    </Stack>
  );
}
