import { Accordion, Grid, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { CollectionV1, hasCollectionUpdateAuthority } from '@metaplex-foundation/mpl-core';
import { authorityManagedPlugins, getCollectionPluginActions, typeToLabel } from '@/lib/plugin';
import { useUmi } from '@/providers/useUmi';
import { LabelTitle } from '@/components/LabelTitle';
import { Approve } from './Approve';
import { Revoke } from './Revoke';
import { Update } from './Update';
import { PermanentFreeze } from './PermanentFreeze';
import { Attributes } from './Attributes';

export function ManageCollectionForm({ collection }: { collection: CollectionV1 }) {
  const umi = useUmi();

  const isUpdateAuth = useMemo(() => hasCollectionUpdateAuthority(umi.identity.publicKey, collection), [umi.identity.publicKey, collection]);
  const actions = useMemo(() => getCollectionPluginActions(umi.identity.publicKey, collection), [umi.identity.publicKey, collection, collection]);

  return (
    <Grid>
      <Grid.Col span={7}>
        <Stack gap="xs">
          <LabelTitle>Actions</LabelTitle>

          {isUpdateAuth && (
            <Accordion variant="separated">
              <Accordion.Item key="update" value="update">
                <Accordion.Control><Text size="sm">Update collection</Text></Accordion.Control>
                <Accordion.Panel><Update collection={collection} /></Accordion.Panel>
              </Accordion.Item>
            </Accordion>

          )}
          {actions.get('permanentFreezeDelegate')?.canUpdate && <PermanentFreeze collection={collection} />}
          {(actions.get('attributes')?.canAdd || actions.get('attributes')?.canUpdate) && (
            <Accordion variant="separated">
              <Accordion.Item key="update" value="update">
                <Accordion.Control><Text size="sm">Update attributes</Text></Accordion.Control>
                <Accordion.Panel><Attributes collection={collection} /></Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}
        </Stack>
      </Grid.Col>
      <Grid.Col span={5}>
        <Stack gap="xs">
          <LabelTitle>Authority-managed plugins</LabelTitle>
          <Accordion variant="separated">
            {authorityManagedPlugins.map((type) => (
              <Accordion.Item key={type} value={type}>
                {(actions.get(type)?.canAppove || actions.get(type)?.canAdd) && (
                  <>
                    <Accordion.Control><Text size="sm">{`Approve ${typeToLabel(type)} delegate`}</Text></Accordion.Control>
                    <Accordion.Panel><Approve collection={collection} type={type} create={actions.get(type)?.canAdd} /></Accordion.Panel>
                  </>
                )}
                {(actions.get(type)?.canRevoke) && (
                  <>
                    <Accordion.Control><Text size="sm">{`Revoke ${typeToLabel(type)} delegate`}</Text></Accordion.Control>
                    <Accordion.Panel><Revoke collection={collection} type={type} /></Accordion.Panel>
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
