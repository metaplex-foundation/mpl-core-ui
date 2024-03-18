import { Button, Center, Fieldset, Flex, Image, Modal, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { useDisclosure } from '@mantine/hooks';
import { generateSigner, publicKey, transactionBuilder } from '@metaplex-foundation/umi';
import { PluginAuthorityPair, RuleSet, createV1, createCollectionV1, nonePluginAuthority, pluginAuthorityPair, pubkeyPluginAuthority, ruleSet } from 'core-preview';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { CreateFormProvider, useCreateForm } from './CreateFormContext';
import { ConfigurePlugins } from './ConfigurePlugins';
import { AuthorityManagedPluginValues, defaultAuthorityManagedPluginValues } from '@/lib/form';

const validatePukey = (value: string) => {
  try {
    publicKey(value);
    return true;
  } catch {
    return false;
  }
};

const validateUri = (value: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const mapPlugins = (plugins: AuthorityManagedPluginValues): PluginAuthorityPair[] => {
  const pairs: PluginAuthorityPair[] = [];
  if (plugins.royalties.enabled) {
    let rs: RuleSet = ruleSet('None');
    if (plugins.royalties.ruleSet === 'Allow list') {
      rs = ruleSet('ProgramAllowList', [plugins.royalties.programs.map((p) => publicKey(p))]);
    } else if (plugins.royalties.ruleSet === 'Deny list') {
      rs = ruleSet('ProgramDenyList', [plugins.royalties.programs.map((p) => publicKey(p))]);
    }
    pairs.push(pluginAuthorityPair({
      type: 'Royalties',
      data: {
        ruleSet: rs,
        basisPoints: plugins.royalties.basisPoints,
        creators: plugins.royalties.creators.map((c) => ({
          percentage: c.percentage,
          address: publicKey(c.address),
        })),
      },
    }));
  }
  if (plugins.soulbound.enabled) {
    pairs.push(pluginAuthorityPair({
      type: 'PermanentFreezeDelegate',
      authority: nonePluginAuthority(),
      data: {
        frozen: true,
      },
    }));
  }
  if (plugins.permanentFreeze.enabled) {
    pairs.push(pluginAuthorityPair({
      type: 'PermanentFreezeDelegate',
      authority: pubkeyPluginAuthority(publicKey(plugins.permanentFreeze.authority)),
      data: {
        frozen: false,
      },
    }));
  }
  if (plugins.permanentTransfer.enabled) {
    pairs.push(pluginAuthorityPair({
      type: 'PermanentTransferDelegate',
      authority: pubkeyPluginAuthority(publicKey(plugins.permanentTransfer.authority)),
    }));
  }
  if (plugins.attributes.enabled) {
    pairs.push(pluginAuthorityPair({
      type: 'Attributes',
      data: {
        attributeList: plugins.attributes.data,
      },
    }));
  }
  if (plugins.update.enabled) {
    pairs.push(pluginAuthorityPair({
      type: 'UpdateDelegate',
      authority: pubkeyPluginAuthority(publicKey(plugins.update.authority)),
    }));
  }
  if (plugins.permanentBurn.enabled) {
    pairs.push(pluginAuthorityPair({
      type: 'PermanentBurnDelegate',
      authority: pubkeyPluginAuthority(publicKey(plugins.permanentFreeze.authority)),
    }));
  }
  return pairs;
};

export function Create() {
  const umi = useUmi();
  const [metadataPreview, setMetadataPreview] = useState<any>(null);
  const [collectionPreview, setCollectionPreview] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useCreateForm({
    initialValues: {
      owner: '',
      collection: 'None',
      name: '',
      uri: 'https://arweave.net/hCW1Ty1bA-T8LoGEXDaABSP2JuTn5cSPHvkH5UHo2eU',
      collectionName: '',
      collectionUri: 'https://arweave.net/hCW1Ty1bA-T8LoGEXDaABSP2JuTn5cSPHvkH5UHo2eU',
      collectionAddress: '',
      assetPlugins: defaultAuthorityManagedPluginValues,
      collectionPlugins: defaultAuthorityManagedPluginValues,
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => value?.length > 0 ? null : 'Name is required',
      uri: (value) => validateUri(value) ? null : 'Invalid URI',
      owner: (value) => !value ? null : validatePukey(value) ? null : 'Invalid public key',
      collectionAddress: (value, values) => {
        if (values.collection !== 'Existing') {
          return null;
        }
        if (!validatePukey(value)) {
          return 'Invalid public key';
        }
        return null;
      },
      collectionName: (value, values) => values.collection !== 'New' ? null : value?.length > 0 ? null : 'Name is required',
      collectionUri: (value, values) => {
        if (values.collection !== 'New') {
          return null;
        }
        if (!validateUri(value)) {
          return 'Invalid URI';
        }
        return null;
      },
      assetPlugins: {
        attributes: {
          data: {
            key: (value, values) => {
              if (values.assetPlugins.attributes.enabled) {
                return value?.length > 0 ? null : true;
              }
              return null;
            },
            value: (value, values) => {
              if (values.assetPlugins.attributes.enabled) {
                return value?.length > 0 ? null : true;
              }
              return null;
            },
          },
        },
        royalties: {
          creators: {
            address: (value, values) => {
              if (values.assetPlugins.royalties.enabled) {
                return validatePukey(value) ? null : true;
              }
              return null;
            },
          },
        },
        update: {
          authority: (value, values) => {
            if (values.assetPlugins.update.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
        permanentFreeze: {
          authority: (value, values) => {
            if (values.assetPlugins.permanentFreeze.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
        permanentTransfer: {
          authority: (value, values) => {
            if (values.assetPlugins.permanentTransfer.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
        permanentBurn: {
          authority: (value, values) => {
            if (values.assetPlugins.permanentBurn.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
      },
      collectionPlugins: {
        attributes: {
          data: {
            key: (value, values) => {
              if (values.assetPlugins.attributes.enabled) {
                return value?.length > 0 ? null : true;
              }
              return null;
            },
            value: (value, values) => {
              if (values.assetPlugins.attributes.enabled) {
                return value?.length > 0 ? null : true;
              }
              return null;
            },
          },
        },
        update: {
          authority: (value, values) => {
            if (values.collectionPlugins.update.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
        permanentFreeze: {
          authority: (value, values) => {
            if (values.collectionPlugins.permanentFreeze.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
        permanentTransfer: {
          authority: (value, values) => {
            if (values.collectionPlugins.permanentTransfer.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
        permanentBurn: {
          authority: (value, values) => {
            if (values.collectionPlugins.permanentBurn.enabled) {
              return validatePukey(value) ? null : 'Invalid public key';
            }
            return null;
          },
        },
      },
    },
  });

  const { collection, uri, collectionUri } = form.values;

  useEffect(() => {
    if (uri) {
      try {
        // eslint-disable-next-line no-new
        new URL(uri);
        const doIt = async () => {
          const j = await (await fetch(uri)).json();
          setMetadataPreview(j);
        };
        doIt();
      } catch (e) {
        setMetadataPreview(null);
      }
    }
  }, [uri, setMetadataPreview]);

  useEffect(() => {
    if (collectionUri) {
      try {
        // eslint-disable-next-line no-new
        new URL(collectionUri);
        const doIt = async () => {
          const j = await (await fetch(collectionUri)).json();
          setCollectionPreview(j);
        };
        doIt();
      } catch (e) {
        setCollectionPreview(null);
      }
    }
  }, [collectionUri, setCollectionPreview]);

  const handleCreate = useCallback(async () => {
    const validateRes = form.validate();
    if (validateRes.hasErrors) {
      return;
    }

    open();
    try {
      const { name, collectionName, collectionPlugins, assetPlugins } = form.values;
      const collectionSigner = generateSigner(umi);
      let txBuilder = transactionBuilder();
      if (collection === 'New') {
        txBuilder = txBuilder.add(createCollectionV1(umi, {
          name: collectionName,
          uri: collectionUri,
          collection: collectionSigner,
          plugins: mapPlugins(collectionPlugins),
        }));
      }
      const assetAddress = generateSigner(umi);
      txBuilder = txBuilder.add(createV1(umi, {
        name,
        uri,
        collection: collection === 'Existing' ? publicKey(form.values.collectionAddress) : collection === 'New' ? collectionSigner.publicKey : undefined,
        asset: assetAddress,
        owner: form.values.owner ? publicKey(form.values.owner) : undefined,
        plugins: mapPlugins(assetPlugins),
      }));

      const res = await txBuilder.sendAndConfirm(umi);
      const sig = base58.deserialize(res.signature)[0];

      console.log(sig);
      notifications.show({
        title: 'Asset created',
        message: `${sig}`,
        color: 'green',
      });
    } finally {
      close();
    }
  }, [form, open, umi]);

  return (
    <CreateFormProvider form={form}>
      <Stack pt="xl">
        <TextInput label="Asset name" {...form.getInputProps('name')} />
        <TextInput
          label="Owner"
          description="Optional wallet to mint the asset to. Defaults to your connected wallet."
          {...form.getInputProps('owner')}
        />
        <TextInput
          label="Asset metadata URI"
          placeholder="https://arweave.net/hCW1Ty1bA-T8LoGEXDaABSP2JuTn5cSPHvkH5UHo2eU"
          description="JSON description of asset conforming to the Metaplex JSON Standard"
          {...form.getInputProps('uri')}
        />
        {metadataPreview && (
          <>
            <Text size="sm" fw="500">Asset preview</Text>
            <Flex gap="lg">
              {metadataPreview.image && <Image
                src={metadataPreview.image}
                height={320}
              />}
              <CodeHighlightTabs
                withExpandButton
                expandCodeLabel="Show full JSON"
                collapseCodeLabel="Show less"
                defaultExpanded={false}
                code={[{
                  fileName: 'metadata.json',
                  language: 'json',
                  code: JSON.stringify(metadataPreview, null, 2),
                }]}
                w={metadataPreview.image ? '50%' : '100%'}
              />

            </Flex>
          </>
        )}

        <Text fw="500" size="md" mt="md">Mint-time asset plugins</Text>
        <ConfigurePlugins type="asset" />
        <Fieldset mt="md" legend="Collection details">
          <Stack>
            <Select
              w="30%"
              label="Collection"
              defaultValue="None"
              {...form.getInputProps('collection')}
              data={['None', 'Existing', 'New']}
            />

            {collection === 'New' && (
              <>
                <TextInput label="Collection name" {...form.getInputProps('collectionName')} />
                <TextInput label="Collection metadata URI" {...form.getInputProps('collectionUri')} />
                {collectionPreview && (
                  <>
                    <Text size="sm" fw="500">Collection preview</Text>
                    <Flex gap="lg">
                      {collectionPreview.image && <Image
                        src={collectionPreview.image}
                        height={320}
                      />}
                      <CodeHighlightTabs
                        withExpandButton
                        expandCodeLabel="Show full JSON"
                        collapseCodeLabel="Show less"
                        defaultExpanded={false}
                        code={[{
                          fileName: 'collection.json',
                          language: 'json',
                          code: JSON.stringify(collectionPreview, null, 2),
                        }]}
                        w={collectionPreview.image ? '50%' : '100%'}
                      />

                    </Flex>
                  </>
                )}
                <div>
                  <Text size="md" fw="500">Add mint-time plugins that apply collection wide</Text>
                  <Text size="sm" c="yellow">Collection plugins will be overridden by a plugin of the same type on the asset</Text>
                </div>
                <ConfigurePlugins type="collection" />
              </>
            )}
            {collection === 'Existing' && <TextInput label="Collection address" {...form.getInputProps('collectionAddress')} miw="30%" />}
          </Stack>
        </Fieldset>

        <Flex gap="lg">
          <Button onClick={handleCreate} disabled={!form.isValid()}>Create Asset</Button>
        </Flex>
        <Modal opened={opened} onClose={() => { }} centered withCloseButton={false}>
          <Center my="xl">
            <Stack gap="md" align="center">
              <Title order={3}>Creating asset...</Title>
              <Text>Be prepared to approve many transactions...</Text>
              <Center w="100%">
                <Text>Some text here</Text>
              </Center>
            </Stack>
          </Center>
        </Modal>
      </Stack>
    </CreateFormProvider>
  );
}
