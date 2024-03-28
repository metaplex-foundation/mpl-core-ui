import { Button, CloseButton, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TransactionBuilder, transactionBuilder } from '@metaplex-foundation/umi';
import { addPluginV1, createPlugin, collectionAddress, updatePluginV1 } from '@metaplex-foundation/mpl-core';
import { useCallback, useState } from 'react';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { notifications } from '@mantine/notifications';
import { useUmi } from '@/providers/useUmi';
import { AssetWithCollection } from '@/lib/type';
import { useInvalidateFetchAssetWithCollection } from '@/hooks/fetch';

export function Attributes({ asset }: AssetWithCollection) {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const { invalidate } = useInvalidateFetchAssetWithCollection();
  const form = useForm({
    initialValues: {
      attributes: asset.attributes?.attributeList || [{
        key: 'key',
        value: 'value',
      }],
    },
    validateInputOnBlur: true,
    validate: {

    },
  });

  const { attributes } = form.values;

  const handleAttributes = useCallback(async () => {
    try {
      setLoading(true);
      let tx: TransactionBuilder = transactionBuilder();

      if (!asset.attributes) {
        tx = addPluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: 'Attributes',
            data: {
              attributeList: form.values.attributes,
            },
          }),
        });
      } else {
        tx = updatePluginV1(umi, {
          asset: asset.publicKey,
          collection: collectionAddress(asset),
          plugin: createPlugin({
            type: 'Attributes',
            data: {
              attributeList: form.values.attributes,
            },
          }),
        });
      }

      const res = await tx.sendAndConfirm(umi);

      const sig = base58.deserialize(res.signature);
      console.log('Attributes complete', sig);
      notifications.show({ title: 'Attributes complete', message: sig, color: 'green' });
      invalidate(asset.publicKey);
    } catch (error: any) {
      console.error('Attributes failed', error);
      notifications.show({ title: 'Attributes failed', message: error.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [umi, form.values.attributes, asset]);
  return (
    <Stack gap="xs">
      {attributes.map(({ key, value }, index) => (
        <Group>
          <TextInput
            value={key}
            defaultValue=""
            {...form.getInputProps(`attributes.${index}.key`)}
          />
          <TextInput
            value={value}
            {...form.getInputProps(`attributes.${index}.value`)}
          />
          <CloseButton
            onClick={() => {
              const newAttributes = [...attributes];
              newAttributes.splice(index, 1);
              form.setFieldValue('attributes', newAttributes);
            }}
          />
        </Group>
      ))}
      <span>
        <Button
          variant="subtle"
          onClick={() => {
            form.setFieldValue('attributes', [
              ...attributes,
              { key: '', value: '' },
            ]);
          }}
        >
          + Add attribute
        </Button>
      </span>

      <Button
        placeholder="Wallet address"
        {...form.getInputProps('destination')}
        loading={loading}
        disabled={!form.isValid()}
        onClick={handleAttributes}
      >Update attributes
      </Button>
    </Stack>
  );
}
