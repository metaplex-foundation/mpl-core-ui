import { Button, Center, Fieldset, Flex, Image, Modal, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { useDisclosure } from '@mantine/hooks';
import { generateSigner, publicKey, sol, transactionBuilder } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { CreateFormProvider, defaultAuthorityManagedPluginValues, useCreateForm } from './CreateFormContext';
import { ConfigurePlugins } from './ConfigurePlugins';

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

export function Create() {
  const umi = useUmi();
  const [metadataPreview, setMetadataPreview] = useState<any>(null);
  const [collectionPreview, setCollectionPreview] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useCreateForm({
    initialValues: {
      collection: 'None',
      name: '',
      uri: 'https://arweave.net/hCW1Ty1bA-T8LoGEXDaABSP2JuTn5cSPHvkH5UHo2eU',
      collectionName: '',
      collectionUri: '',
      collectionAddress: '',
      assetPlugins: defaultAuthorityManagedPluginValues,
      collectionPlugins: defaultAuthorityManagedPluginValues,
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => value?.length > 0 ? null : 'Name is required',
      uri: (value) => validateUri(value) ? null : 'Invalid URI',
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
      const { name, collectionName } = form.values;
      const collectionSigner = generateSigner(umi);
      let txBuilder = transactionBuilder();
      if (collection === 'New') {
        txBuilder = txBuilder.add(createCollection(umi, {
          name: collectionName,
          uri: collectionUri,
          collection: collectionSigner,
        }));
      }
      const assetAddress = generateSigner(umi);
      txBuilder = txBuilder.add(create(umi, {
        name,
        uri,
        collection: collection === 'Existing' ? publicKey(form.values.collectionAddress) : collection === 'New' ? collectionSigner.publicKey : undefined,
        asset: assetAddress,
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
      <Stack>
        <TextInput label="Asset name" {...form.getInputProps('name')} />
        <TextInput label="Asset metadata URI" placeholder="https://arweave.net/hCW1Ty1bA-T8LoGEXDaABSP2JuTn5cSPHvkH5UHo2eU" description="JSON description of asset conforming to the Metaplex JSON Standard" {...form.getInputProps('uri')} />
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
        <Fieldset mt="lg" legend="Collection details">
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
          <Button
            variant="outline"
            onClick={async () => {
              console.log('airdropping');
              await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
              console.log('done');
            }}
          >Airdrop
          </Button>
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
