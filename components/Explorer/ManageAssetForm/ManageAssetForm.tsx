import { Accordion, Grid, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { canBurn, canTransfer, hasAssetUpdateAuthority } from '@metaplex-foundation/mpl-core';
import { authorityManagedPlugins, getAssetPluginActions, ownerManagedPlugins, typeToLabel } from '@/lib/plugin';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { Transfer } from './Transfer';
import { LabelTitle } from '@/components/LabelTitle';
import { Burn } from './Burn';
import { Approve } from './Approve';
import { Revoke } from './Revoke';
import { Update } from './Update';
import { Freeze } from './Freeze';
import { PermanentFreeze } from './PermanentFreeze';
import { Attributes } from './Attributes';

export function ManageAssetForm({ asset, collection }: AssetWithCollection) {
  const umi = useUmi();

  const isOwner = useMemo(() => asset.owner === umi.identity.publicKey, [umi.identity.publicKey, asset]);
  const isUpdateAuth = useMemo(() => hasAssetUpdateAuthority(umi.identity.publicKey, asset, collection), [umi.identity.publicKey, asset, collection]);
  const actions = useMemo(() => getAssetPluginActions(umi.identity.publicKey, asset, collection), [umi.identity.publicKey, asset, collection]);
  const burn = useMemo(() => canBurn(umi.identity.publicKey, asset, collection), [umi.identity.publicKey, asset, collection]);
  const transfer = useMemo(() => canTransfer(umi.identity.publicKey, asset, collection), [umi.identity.publicKey, asset, collection]);

  return (
    <Grid>
      <Grid.Col span={7}>
        <Stack gap="xs">
          <LabelTitle>Actions</LabelTitle>
          {transfer && !isOwner && <Transfer asset={asset} />}
          {burn && <Burn asset={asset} />}
          {(actions.get('freezeDelegate')?.canAdd || actions.get('freezeDelegate')?.canUpdate) && <Freeze asset={asset} />}
          {actions.get('permanentFreezeDelegate')?.canUpdate && <PermanentFreeze asset={asset} />}
          {isUpdateAuth && (
            <Accordion variant="separated">
              <Accordion.Item key="update" value="update">
                <Accordion.Control><Text size="sm">Update asset</Text></Accordion.Control>
                <Accordion.Panel><Update asset={asset} /></Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}
          {(actions.get('attributes')?.canAdd || actions.get('attributes')?.canUpdate) && (
            <Accordion variant="separated">
              <Accordion.Item key="update" value="update">
                <Accordion.Control><Text size="sm">Update attributes</Text></Accordion.Control>
                <Accordion.Panel><Attributes asset={asset} /></Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}
        </Stack>
      </Grid.Col>
      <Grid.Col span={5}>
        <Stack gap="xs">
          <LabelTitle>Owner-managed plugins</LabelTitle>
          <Accordion variant="separated">
            {ownerManagedPlugins.map((type) => (
              <Accordion.Item key={type} value={type}>
                {(actions.get(type)?.canAppove || actions.get(type)?.canAdd) && (
                  <>
                    <Accordion.Control><Text size="sm">{`Approve ${typeToLabel(type)} delegate`}</Text></Accordion.Control>
                    <Accordion.Panel><Approve asset={asset} type={type} create={actions.get(type)?.canAdd} /></Accordion.Panel>
                  </>
                )}
                {(actions.get(type)?.canRevoke) && (
                  <>
                    <Accordion.Control><Text size="sm">{`Revoke ${typeToLabel(type)} delegate`}</Text></Accordion.Control>
                    <Accordion.Panel><Revoke asset={asset} type={type} /></Accordion.Panel>
                  </>
                )}
              </Accordion.Item>
            ))}
          </Accordion>
          <LabelTitle>Authority-managed plugins</LabelTitle>
          <Accordion variant="separated">
            {authorityManagedPlugins.map((type) => (
              <Accordion.Item key={type} value={type}>
                {(actions.get(type)?.canAppove || actions.get(type)?.canAdd) && (
                  <>
                    <Accordion.Control><Text size="sm">{`Approve ${typeToLabel(type)} delegate`}</Text></Accordion.Control>
                    <Accordion.Panel><Approve asset={asset} type={type} create={actions.get(type)?.canAdd} /></Accordion.Panel>
                  </>
                )}
                {(actions.get(type)?.canRevoke) && (
                  <>
                    <Accordion.Control><Text size="sm">{`Revoke ${typeToLabel(type)} delegate`}</Text></Accordion.Control>
                    <Accordion.Panel><Revoke asset={asset} type={type} /></Accordion.Panel>
                  </>
                )}
              </Accordion.Item>
            ))}
          </Accordion>
        </Stack>
      </Grid.Col>
    </Grid>

  );
}
