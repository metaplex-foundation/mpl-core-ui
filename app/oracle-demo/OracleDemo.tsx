import { Button, Center, Code, Container, Group, List, Loader, Modal, Paper, Select, SimpleGrid, Stack, Stepper, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { generateSigner, PublicKey } from '@metaplex-foundation/umi';
import { AssetV1, CheckResult, create, fetchAssetV1, update } from '@metaplex-foundation/mpl-core';
import { fetchValidation, fixedAccountInit, fixedAccountSet, Validation } from '@metaplex-foundation/mpl-core-oracle-example';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { ExternalValidationResult } from '@metaplex-foundation/mpl-core-oracle-example/dist/src/hooked';
import { notifications } from '@mantine/notifications';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useDisclosure } from '@mantine/hooks';
import { useUmi } from '@/providers/useUmi';
import { ExplorerStat } from '@/components/Explorer/ExplorerStat';

export const OracleDemo = () => {
  const umi = useUmi();
  const form = useForm<{
    oracleAccount: null | PublicKey;
    asset: null | AssetV1
    name: string,
    oracleData: 'Pass' | 'Rejected'
    validation: null | Validation
  }>({
    initialValues: {
      oracleAccount: null,
      asset: null,
      name: 'Test name',
      oracleData: 'Pass',
      validation: null,
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [modalMessage, setModalMessage] = useState('');
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper
        mt="lg"
        active={active}
        onStepClick={setActive}
      // allowNextStepsSelect={false}
      >
        <Stepper.Step label="Configure an Oracle" description="Create an Oracle configuration">
          <Container my="xl">
            <Stack>
              <Title order={2}>Configure an Oracle</Title>
              <Text>Oracle plugins can control whether an asset lifecycle event can happen via an account or accounts defined by the creator.
                The accounts do <i>not</i> need to be owned or written to by the MPL Core program and can be on-curve addresses or PDA&apos;s.
              </Text>
              <div>
                <Text>The eligble asset lifecycle events are: </Text>
                <List>
                  <List.Item><Code>Create</Code></List.Item>
                  <List.Item><Code>Transfer</Code></List.Item>
                  <List.Item><Code>Update</Code></List.Item>
                  <List.Item><Code>Burn</Code></List.Item>
                </List>
              </div>

              <Text>This demo will use a static on-curve randomly generated account. Due to Solana&apos;s programming model, writing data to an account requires an on-chain program. In this example
                we are using an extremely simple Anchor program.
              </Text>
              <Text>View or fork the example oracle program source code <a target="_blank" href="https://github.com/metaplex-foundation/mpl-core-oracle-exmple" rel="noreferrer">here</a>.</Text>

              <Title order={3}>Oracle format</Title>
              <Text>The Oracle account will data conform to the following format, serialized using Borsch:</Text>

              <CodeHighlightTabs
                withExpandButton
                expandCodeLabel="Show more"
                collapseCodeLabel="Show less"
                defaultExpanded={false}
                code={[{
                  fileName: 'rust',
                  language: 'rust',
                  code: `
/// Validation results struct for an Oracle account.
#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, Eq, PartialEq)]
pub enum OracleValidation {
    /// Version 1 of the format.
    V1 {
        /// Validation for the the create lifecycle action.
        create: ExternalValidationResult,
        /// Validation for the transfer lifecycle action.
        transfer: ExternalValidationResult,
        /// Validation for the burn lifecycle action.
        burn: ExternalValidationResult,
        /// Validation for the update lifecycle action.
        update: ExternalValidationResult,
    },
}

/// External plugins lifecycle validations
/// External plugins utilize this to indicate whether they approve or reject a lifecycle action.
#[derive(Eq, PartialEq, Debug, Clone, BorshDeserialize, BorshSerialize)]
pub enum ExternalValidationResult {
    /// The plugin approves the lifecycle action.
    Approved,
    /// The plugin rejects the lifecycle action.
    Rejected,
    /// The plugin abstains from approving or rejecting the lifecycle action.
    Pass,
}
                  `,
                }]}
              />

              <Text>See the <a target="_blank" href="https://developers.metaplex.com/core" rel="noreferrer">documentation</a> for more configuration options.</Text>
              <Button onClick={async () => {
                setModalMessage('Creating Oracle account...');
                open();
                try {
                  const oracleSigner = generateSigner(umi);
                  const res = await fixedAccountInit(umi, {
                    signer: umi.identity,
                    account: oracleSigner,
                    args: {
                      oracleData: {
                        __kind: 'V1',
                        create: ExternalValidationResult.Pass,
                        transfer: ExternalValidationResult.Pass,
                        burn: ExternalValidationResult.Pass,
                        update: ExternalValidationResult.Rejected,
                      },
                    },
                  }).sendAndConfirm(umi);
                  form.setFieldValue('oracleAccount', oracleSigner.publicKey);

                  form.setFieldValue('validation', await fetchValidation(umi, oracleSigner.publicKey));
                  const sig = base58.deserialize(res.signature)[0];
                  notifications.show({
                    title: 'Oracle account created',
                    message: sig,
                    color: 'green',
                  });
                  console.log('Oracle account created', sig);
                } catch (e: any) {
                  console.error(e);
                  notifications.show({
                    title: 'Failed to create Oracle account',
                    message: e.toString(),
                    color: 'red',
                  });
                } finally {
                  close();
                }
              }}
              >Create Oracle account
              </Button>

              {form.values.oracleAccount && (
                <ExplorerStat
                  label="Oracle account"
                  value={form.values.oracleAccount}
                  copyable
                />
              )}
              <Group justify="center" mt="md">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!form.values.oracleAccount}>Next step</Button>
              </Group>
            </Stack>
          </Container>
        </Stepper.Step>
        <Stepper.Step label="Create an Asset" description="Add the Oracle plugin">
          <Container my="xl">
            <Stack>
              <Title order={2}>Configure an Asset</Title>
              <Text>Create an asset with the Oracle plugin that contains the configuration to read the Oracle account created in Step 1.</Text>

              <Text>Below shows some sample Typescript code to create an Asset with the Oracle plugin:</Text>

              <CodeHighlightTabs
                withExpandButton
                expandCodeLabel="Show more"
                collapseCodeLabel="Show less"
                defaultExpanded={false}
                code={[{
                  fileName: 'typescript',
                  language: 'typescript',
                  code: `
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: 'Test name',
  uri: 'https://example.com',
  plugins: [
    {
      type: 'Oracle', // Add an Oracle 
      resultsOffset: {
        type: 'Anchor', // Anchor programs have an 8 byte discriminator
      },
      lifecycleChecks: { 
        update: // Register the Oracle to control the update lifecycle event
          [CheckResult.CAN_REJECT], // Oracles may only reject lifecycle events
      },
      baseAddress: account.publicKey, // the Oracle created in Step 1
    },
  ],
}).sendAndConfirm(umi);
                  ` }]}
              />

              {form.values.asset && (
                <ExplorerStat
                  label="Asset mint"
                  value={form.values.asset.publicKey}
                  copyable
                />

              )}

              <Button onClick={async () => {
                setModalMessage('Creating Asset...');
                open();
                try {
                  const asset = generateSigner(umi);
                  const res = await create(umi, {
                    asset,
                    name: 'Test name',
                    uri: 'https://example.com',
                    plugins: [
                      {
                        type: 'Oracle',
                        resultsOffset: {
                          type: 'Anchor',
                        },
                        lifecycleChecks: {
                          update: [CheckResult.CAN_REJECT],
                        },
                        baseAddress: form.values.oracleAccount!,
                      },
                    ],
                  }).sendAndConfirm(umi);

                  form.setFieldValue('asset', await fetchAssetV1(umi, asset.publicKey));
                  const sig = base58.deserialize(res.signature)[0];
                  notifications.show({
                    title: 'Asset created',
                    message: sig,
                    color: 'green',
                  });
                  console.log('Asset created', sig);
                } catch (e: any) {
                  console.error(e);
                  notifications.show({
                    title: 'Failed to create Asset',
                    message: e.toString(),
                    color: 'red',
                  });
                } finally {
                  close();
                }
              }}
              >Create Asset
              </Button>
              <Group justify="center" mt="md">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!form.values.asset}>Next step</Button>
              </Group>
            </Stack>
          </Container>
        </Stepper.Step>
        <Stepper.Step label="Control the Asset" description="Control the Asset by updating the Oracle">
          <Container my="xl">
            <Stack>
              <Title order={2}>Control the Asset</Title>
              <Text>Update the Oracle to control whether updating the Asset name will succeed.</Text>
              <SimpleGrid cols={2}>
                <Paper p="lg">
                <Stack>
                  <Title order={4}>Update Asset</Title>
                  <ExplorerStat
                    label="Asset address"
                    value={form.values.asset?.publicKey || ''}
                    copyable
                  />
                  <ExplorerStat
                    label="Current name"
                    value={form.values.asset?.name || ''}
                  />
                  <TextInput
                    label="New Asset name"
                    description="Choose a new name for the Asset"
                    {...form.getInputProps('name')}
                  />
                  <Button onClick={async () => {
                    setModalMessage('Updating Asset name...');
                    open();
                    try {
                      const res = await update(umi, {
                        asset: form.values.asset!,
                        name: form.values.name,
                      }).sendAndConfirm(umi);

                      form.setFieldValue('asset', await fetchAssetV1(umi, form.values.asset!.publicKey));
                      const sig = base58.deserialize(res.signature)[0];
                      notifications.show({
                        title: 'Asset name updated',
                        message: sig,
                        color: 'green',
                      });
                      console.log('Asset name updated', sig);
                    } catch (e: any) {
                      console.error(e);
                      notifications.show({
                        title: 'Failed to update Asset name',
                        message: e.toString(),
                        color: 'red',
                      });
                    } finally {
                      close();
                    }
                  }}
                  >Update name
                  </Button>
                  {(form.values.validation?.validation as Extract<Validation['validation'], { __kind: 'V1' }>)?.update === ExternalValidationResult.Rejected && <Text c="red" fz="xs">Oracle is currently blocking this update, we expect the transaction to fail.</Text>}
                </Stack>
                </Paper>
                <Paper p="lg">
                <Stack>
                <Title order={4}>Update Oracle</Title>
                  <ExplorerStat
                    label="Oracle account"
                    value={form.values.oracleAccount || ''}
                    copyable
                  />
                  <ExplorerStat
                    label="Current oracle 'update' value"
                    value={form.values.validation ? ((form.values.validation.validation as Extract<Validation['validation'], { __kind: 'V1' }>).update === ExternalValidationResult.Rejected ? 'Rejected' : 'Pass') : ''}
                  />
                  <Select
                    label="New Oracle 'update' value"
                    description="Choose 'Reject' to block an update and 'Pass' to allow updates."
                    data={['Rejected', 'Pass']}
                    {...form.getInputProps('oracleData')}
                  />
                  <Button onClick={async () => {
                    setModalMessage('Updating Oracle account...');
                    open();
                    try {
                      const res = await fixedAccountSet(umi, {
                        signer: umi.identity,
                        account: form.values.oracleAccount!,
                        args: {
                          oracleData: {
                            __kind: 'V1',
                            create: ExternalValidationResult.Pass,
                            transfer: ExternalValidationResult.Pass,
                            burn: ExternalValidationResult.Pass,
                            update: form.values.oracleData === 'Rejected' ? ExternalValidationResult.Rejected : ExternalValidationResult.Pass,
                          },
                        },
                      }).sendAndConfirm(umi);

                      form.setFieldValue('validation', await fetchValidation(umi, form.values.oracleAccount!));
                      const sig = base58.deserialize(res.signature)[0];
                      notifications.show({
                        title: 'Oracle account updated',
                        message: sig,
                        color: 'green',
                      });
                      console.log('Oracle account updated', sig);
                    } catch (e: any) {
                      console.error(e);
                      notifications.show({
                        title: 'Failed to update Oracle account',
                        message: e.toString(),
                        color: 'red',
                      });
                    } finally {
                      close();
                    }
                  }}
                  >Update Oracle
                  </Button>
                </Stack>
                </Paper>
              </SimpleGrid>
              <Title order={2} mt="xl">Start Building</Title>
              <Text>See how to configure a single Oracle plugin for a whole Collection <a target="_blank" href="https://developers.metaplex.com/core" rel="noreferrer">here</a> using the <i>pre-configured Asset PDA</i> accounts.</Text>
              <Text>See the <a target="_blank" href="https://developers.metaplex.com/core" rel="noreferrer">documentation</a> for more Oracle plugin configuration options.</Text>
              <Text>View or fork the example oracle program source code <a target="_blank" href="https://github.com/metaplex-foundation/mpl-core-oracle-example" rel="noreferrer">here</a>.</Text>

            </Stack>
          </Container>
        </Stepper.Step>
      </Stepper>
      <Modal opened={opened} onClose={() => { }} centered withCloseButton={false}>
        <Center my="xl">
          <Stack gap="md" align="center">
            <Text>{modalMessage}</Text>
            <Loader size="md" my="lg" />
          </Stack>
        </Center>
      </Modal>
    </>

  );
};
