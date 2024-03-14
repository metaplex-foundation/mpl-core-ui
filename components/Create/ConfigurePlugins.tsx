import { Accordion, Checkbox, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { useCallback, useState } from 'react';
import { AuthorityManagedPluginValues, useCreateFormContext } from './CreateFormContext';

interface AccordionItemProps {
  id: string
  enabled?: boolean;
  label: string;
  description: string;
  children: React.ReactNode;
  onChange: (value: boolean) => void;
}

function AccordionItem({ id, label, description, children, enabled, onChange }: AccordionItemProps) {
  return (
    <Accordion.Item value={id} key={label}>
      <Accordion.Control>
        <Group>
          <Checkbox
            checked={enabled}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onChange={(event) => onChange(event.currentTarget.checked)}
          />
          <div>
            <Text>{label}</Text>
            <Text size="sm" c="dimmed" fw={400}>
              {description}
            </Text>
          </div>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {children}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export function ConfigurePlugins({ type }: { type: 'asset' | 'collection' }) {
  const [accordianValue, setAccordianValue] = useState<string | null>(null);
  const form = useCreateFormContext();
  const createAccordianInputHelper = (pluginName: keyof AuthorityManagedPluginValues) => ({
    id: pluginName,
    enabled: form.values[`${type}Plugins`]?.[pluginName]?.enabled,
    onChange: (value: boolean) => {
      form.setFieldValue(`${type}Plugins.${pluginName}.enabled`, value);
      if (value) {
        setAccordianValue(pluginName);
      }
    },
  });

  const getPrefix = useCallback((pluginName: keyof AuthorityManagedPluginValues) => `${type}Plugins.${pluginName}`, [type]);
  return (
    <Accordion variant="separated" value={accordianValue} onChange={setAccordianValue}>
      <AccordionItem
        label="Royalties"
        description={`Add royalty enforcement to your ${type}`}
        {...createAccordianInputHelper('royalties')}
      >
        <Stack>
          <NumberInput label="Basis points" description="500 basis points is 5%" min={0} max={10000} defaultValue={500} {...form.getInputProps(`${getPrefix('royalties')}.basisPoints`)} />
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Soulbound"
        description={`Make your ${type} soulbound`}
        {...createAccordianInputHelper('soulbound')}
      >
        <Stack>
          <Text size="sm">A soulbound asset means that it bound to the wallet that the asset is minted to.</Text>
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Attributes"
        description={`Attach custom on-chain data to your ${type}`}
        {...createAccordianInputHelper('attributes')}
      >
        <Stack>
          <Text size="sm">Attaching key-value attributes allows on-chain and indexers programs to interact with your {type}. DAS providers supporting mpl-core will automatically index this data.</Text>
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Update delegate"
        description={`Set an authority on your ${type} that can change the data of the ${type}`}
        {...createAccordianInputHelper('update')}
      >
        <Stack>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`]?.update?.enabled}
            {...form.getInputProps(`${getPrefix('update')}.authority`)}
          />
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Permanent freeze delegate"
        description={`Set an authority on your ${type} that can freeze the ${type}`}
        {...createAccordianInputHelper('permanentFreeze')}
      >
        <Stack>
          <Text size="sm">Owners of the asset cannot remove this delegate, only the freeze authority may remove itself.</Text>
          <Text size="sm" c="red" fw="700">Permanent plugins may only be added at mint time.</Text>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`]?.permanentFreeze?.enabled}
            {...form.getInputProps(`${getPrefix('permanentFreeze')}.authority`)}
          />
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Permanent transfer delegate"
        description={`Set an authority on your ${type} that can transfer the ${type}`}
        {...createAccordianInputHelper('permanentTransfer')}
      >
        <Stack>
          <Text size="sm">Owners of the asset cannot remove this delegate, only the transfer authority may remove itself.</Text>
          <Text size="sm" c="red" fw="700">Permanent plugins may only be added at mint time.</Text>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`]?.permanentTransfer?.enabled}
            {...form.getInputProps(`${getPrefix('permanentTransfer')}.authority`)}
          />
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Permanent burn delegate"
        description={`Set an authority on your ${type} that can burn the ${type}`}
        {...createAccordianInputHelper('permanentBurn')}
      >
        <Stack>
          <Text size="sm">Owners of the asset cannot remove this delegate, only the burn authority may remove itself.</Text>
          <Text size="sm" c="red" fw="700">Permanent plugins may only be added at mint time.</Text>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`]?.permanentBurn?.enabled}
            {...form.getInputProps(`${getPrefix('permanentBurn')}.authority`)}
          />
        </Stack>
      </AccordionItem>

    </Accordion>
  );
}
