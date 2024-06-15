import { Button, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { collect } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { validatePubkey } from '@/lib/form';
import { useUmi } from '@/providers/useUmi';

export const Collect = () => {
  const umi = useUmi();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      item: '',
    },
    validateInputOnBlur: true,
    validate: {
      item: (value) => {
        if (validatePubkey(value)) {
          return null;
        }
        return 'Invalid address';
      },
    },
  });

  return (
    <Stack>
        <TextInput label="Item" placeholder="Enter item address" required {...form.getInputProps('item')} />
        <Button
          disabled={!form.isValid()}
          loading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const tx = await collect(umi, {
              }).addRemainingAccounts({
                isSigner: false,
                isWritable: true,
                pubkey: publicKey(form.values.item),
              }).sendAndConfirm(umi);

              const sig = base58.deserialize(tx.signature)[0];
              console.log(sig);
              notifications.show({
                title: 'Success',
                message: 'Item collected',
                color: 'green',
              });
            } catch (error: any) {
              console.error(error);
              notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
              });
            } finally {
              setLoading(false);
            }
          }}
        >Collect
        </Button>
    </Stack>
  );
};
