import { Accordion, Alert, Button, Checkbox, CloseButton, Flex, Group, MultiSelect, NumberInput, Select, Stack, TagsInput, Text, TextInput, Title } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { useCreateFormContext } from './CreateFormContext';
import { AuthorityManagedPluginValues, defaultAuthorityManagedPluginValues } from '@/lib/form';
import { ExtraAccountConfigurator } from './ExtraAccountConfigurator';

interface AccordionItemProps {
  id: string
  enabled?: boolean;
  disabled?: boolean;
  label: string;
  description: string;
  children: React.ReactNode;
  onChange?: (value: boolean) => void;
}

function AccordionItem({ id, label, description, children, enabled, disabled, onChange }: AccordionItemProps) {
  return (
    <Accordion.Item value={id} key={label}>
      <Accordion.Control>
        <Group>
          <Checkbox
            checked={enabled}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onChange={(event) => onChange?.(event.currentTarget.checked)}
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
    enabled: form.values[`${type}Plugins`][pluginName].enabled,
    onChange: (value: boolean) => {
      form.setFieldValue(`${type}Plugins.${pluginName}.enabled`, value);
      if (value) {
        setAccordianValue(pluginName);
      }
    },
  });

  const getPrefix = useCallback((pluginName: keyof AuthorityManagedPluginValues) => `${type}Plugins.${pluginName}`, [type]);
  const attributes = form.values[`${type}Plugins`].attributes.data;
  const { oracles } = form.values[`${type}Plugins`].oracle;
  const { creators, ruleSet, enabled: royaltiesEnabled } = form.values[`${type}Plugins`].royalties;
  const alertIcon = <IconInfoCircle />;

  useEffect(() => {
    if (!royaltiesEnabled) {
      form.clearFieldError(`${getPrefix('royalties')}.creators.percentage`);
    }
    let sum = 0;
    creators.forEach((c) => {
      sum += c.percentage;
    });
    if (sum !== 100) {
      form.setFieldError(`${getPrefix('royalties')}.creators.percentage`, 'Creator percentages must sum to 100');
      return;
    }
    form.clearFieldError(`${getPrefix('royalties')}.creators.percentage`);
  }, [creators, royaltiesEnabled]);

  return (
    <Accordion variant="separated" value={accordianValue} onChange={setAccordianValue}>
      <AccordionItem
        label="Royalties"
        description={`Add royalty enforcement to your ${type}`}
        {...createAccordianInputHelper('royalties')}
      >
        <Stack>
          <NumberInput
            label="Basis points"
            description="500 basis points is 5%"
            maw="30%"
            min={0}
            max={10000}
            defaultValue={500}
            {...form.getInputProps(`${getPrefix('royalties')}.basisPoints`)}
          />
          <div>
            <Stack>
              {creators.map(({ address, percentage }, index) => (
                <Flex align="center">
                  <TextInput
                    value={address}
                    label={index === 0 ? 'Creator address' : undefined}
                    defaultValue=""
                    mr="md"
                    {...form.getInputProps(`${getPrefix('royalties')}.creators.${index}.address`)}
                  />
                  <NumberInput
                    value={percentage}
                    label={index === 0 ? 'Share' : undefined}
                    suffix="%"
                    min={0}
                    max={100}
                    mr="xs"
                    {...form.getInputProps(`${getPrefix('royalties')}.creators.${index}.percentage`)}
                  />
                  {index !== 0 && <CloseButton
                    onClick={() => {
                      form.removeListItem(`${type}Plugins.royalties.creators`, index);
                    }}
                  />}
                </Flex>
              ))}
              {form.errors[`${type}Plugins.royalties.creators.percentage`] && (
                <Text color="red" size="xs">{form.errors[`${type}Plugins.royalties.creators.percentage`]}</Text>
              )}
            </Stack>
            <span>
              <Button
                variant="transparent"
                onClick={() => {
                  form.setFieldValue(`${type}Plugins.royalties.creators`, [
                    ...creators,
                    { address: '', percentage: 0 },
                  ]);
                }}
              >
                + Add creator
              </Button>
            </span>
          </div>
          <Select
            label="Royalty rule set"
            description={`Configure which programs can interact with your ${type}`}
            defaultValue="None"
            data={['None', 'Allow list', 'Deny list']}
            maw="30%"
            value={ruleSet}
            {...form.getInputProps(`${getPrefix('royalties')}.ruleSet`)}
          />
          {ruleSet === 'None' && (
            <Text size="sm">This is the most permissive rule set, also known as the compatability rule set.</Text>
          )}
          {ruleSet === 'Allow list' && (
            <>
              <Text size="sm">This is the most restrictive rule set. Only allow programs on this list to interact with this {type}</Text>
              <TagsInput
                label="Press Enter to add a program address"
                placeholder="Enter program addresses"
                {...form.getInputProps(`${getPrefix('royalties')}.programs`)}
              />
            </>
          )}
          {ruleSet === 'Deny list' && (
            <>
              <Text size="sm">Deny programs on this list to interact with this {type}</Text>
              <TagsInput
                label="Press Enter to add a program address"
                placeholder="Enter program addresses"
                {...form.getInputProps(`${getPrefix('royalties')}.programs`)}
              />
            </>
          )}
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Soulbound"
        description={`Make your ${type} soulbound`}
        {...createAccordianInputHelper('soulbound')}
        onChange={(value: boolean) => {
          form.setFieldValue(`${type}Plugins.soulbound.enabled`, value);
          if (value) {
            setAccordianValue('soulbound');
            form.setFieldValue(`${type}Plugins.permanentFreeze.enabled`, false);
          }
        }}
      >
        <Stack>
          <Text size="sm">A soulbound asset means that it bound to the wallet that the asset is minted to.</Text>
          <Alert variant="light" color="yellow" title="" icon={alertIcon}>
            Soulbound cannot be used in conjunction with the Permanent Freeze plugin.
          </Alert>
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Attributes"
        description={`Attach custom on-chain data to your ${type}`}
        {...createAccordianInputHelper('attributes')}
      >
        <Stack>
          <Text size="sm">Attaching key-value attributes allows on-chain and indexers programs to interact with your {type}. DAS providers supporting mpl-core will automatically index this data.</Text>

          {attributes.map(({ key, value }, index) => (
            <Group>
              <TextInput
                value={key}
                defaultValue=""
                {...form.getInputProps(`${getPrefix('attributes')}.data.${index}.key`)}
              />
              <TextInput
                value={value}
                {...form.getInputProps(`${getPrefix('attributes')}.data.${index}.value`)}
              />
              <CloseButton
                onClick={() => {
                  const newAttributes = [...attributes];
                  newAttributes.splice(index, 1);
                  form.setFieldValue(`${type}Plugins.attributes.data`, newAttributes);
                }}
              />
            </Group>
          ))}
          <span>
            <Button
              variant="subtle"
              onClick={() => {
                form.setFieldValue(`${type}Plugins.attributes.data`, [
                  ...attributes,
                  { key: '', value: '' },
                ]);
              }}
            >
              + Add attribute
            </Button>
          </span>

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
            required={form.values[`${type}Plugins`].update.enabled}
            {...form.getInputProps(`${getPrefix('update')}.authority`)}
          />
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Permanent freeze delegate"
        description={`Set an authority on your ${type} that can freeze the ${type}`}
        {...createAccordianInputHelper('permanentFreeze')}
        // Override the to be exclusive with soulbound
        onChange={(value: boolean) => {
          form.setFieldValue(`${type}Plugins.permanentFreeze.enabled`, value);
          if (value) {
            setAccordianValue('permanentFreeze');
            form.setFieldValue(`${type}Plugins.soulbound.enabled`, false);
          }
        }}
      >
        <Stack>
          <Text size="sm">Owners of the asset cannot remove this delegate, only the freeze authority may remove itself.</Text>
          <Alert variant="light" color="yellow" title="" icon={alertIcon}>
            Permanent plugins may only be added at mint time.
          </Alert>
          <Alert variant="light" color="yellow" title="" icon={alertIcon}>
            Permanent freeze cannot be used in conjunction with the Soulbound plugin.
          </Alert>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`].permanentFreeze.enabled}
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
          <Alert variant="light" color="yellow" title="" icon={alertIcon}>
            Permanent plugins may only be added at mint time.
          </Alert>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`].permanentTransfer.enabled}
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
          <Alert variant="light" color="yellow" title="" icon={alertIcon}>
            Permanent plugins may only be added at mint time.
          </Alert>
          <TextInput
            label="Authority"
            placeholder="Enter a public key"
            required={form.values[`${type}Plugins`].permanentBurn.enabled}
            {...form.getInputProps(`${getPrefix('permanentBurn')}.authority`)}
          />
        </Stack>
      </AccordionItem>
      <AccordionItem
        label="Oracle"
        description={`Allow one more oracles to control your ${type}`}
        {...createAccordianInputHelper('oracle')}
      >
        <Stack>
          <Text size="sm">Oracles can register for and block specific lifecycle events on your asset(s) asynchronously.</Text>
          <Alert variant="light" color="yellow" title="" icon={alertIcon}>
            Only add oracles you trust or you have built yourself as they may limit or break the functionality of your collection!
          </Alert>
          {oracles.map(({ offset, baseAddressConfig }, index) => {
            const getInputProps = (key: string) => form.getInputProps(`${getPrefix('oracle')}.oracles.${index}.${key}`);
            return (
              <Stack>
                <Flex align="center">
                  <Title order={4} size="sm">Oracle {index + 1}</Title>
                  <CloseButton
                    onClick={() => {
                      const newOracles = [...oracles];
                      newOracles.splice(index, 1);
                      form.setFieldValue(`${type}Plugins.oracle.oracles`, newOracles);
                    }}
                  />

                </Flex>
                <TextInput
                  label="Base address"
                  description="A static address or an oracle program address if using PDA's"
                  {...getInputProps('baseAddress')}
                />
                <MultiSelect
                  label="Registered lifecycles"
                  data={['Create', 'Transfer', 'Burn', 'Update']}
                  {...getInputProps('lifecycles')}
                />

                <Select
                  label="Offset type"
                  defaultValue="Anchor"
                  data={['NoOffset', 'Anchor', 'Custom']}
                  {...getInputProps('offset.type')}
                />

                {offset.type === 'Custom' && (
                  <NumberInput
                    label="Offset"
                    {...getInputProps('offset.offset')}
                  />
                )}

                <ExtraAccountConfigurator
                  label="Oracle account derivation"
                  extraAccount={baseAddressConfig}
                  error={form.errors[`${getPrefix('oracle')}.oracles.${index}.baseAddressConfig`] as string}
                  setExtraAccount={(value) => form.setFieldValue(`${getPrefix('oracle')}.oracles.${index}.baseAddressConfig`, value)}
                />

              </Stack>);
          })}
          <span>
            <Button
              variant="subtle"
              onClick={() => {
                form.setFieldValue(`${type}Plugins.oracle.oracles`, [
                  ...oracles,
                  defaultAuthorityManagedPluginValues.oracle.oracles[0],
                ]);
              }}
            >
              + Add oracle
            </Button>
          </span>
        </Stack>
      </AccordionItem>
      {type === "asset" && <AccordionItem
        label="Edition Plugin"
        description={`Make your asset an Edition`}
        {...createAccordianInputHelper('edition')}
      >
        <Stack>
          <NumberInput
            label="number"
            placeholder="The Number of the Edition"
            required={form.values[`${type}Plugins`].edition.enabled}
            {...form.getInputProps(`${getPrefix('edition')}.number`)}
          />
        </Stack>
      </AccordionItem>}
      {type === "collection" && <AccordionItem
        label="Master Edition Plugin"
        description={`group Editions, provide provenance and store the maximum edition supply`}
        {...createAccordianInputHelper('masterEdition')}
      >
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter the Name of your Master Edition (if different to the Collection Name)"
            {...form.getInputProps(`${getPrefix('masterEdition')}.name`)}
          />
          <TextInput
            label="URI"
            placeholder="URI of the Editions (if different to the Collection URI)"
            {...form.getInputProps(`${getPrefix('masterEdition')}.uri`)}
          />
          <NumberInput
            label="maxSupply"
            placeholder="Indicate how many prints will exist as maximum. Optional to allow Open Editions"
            {...form.getInputProps(`${getPrefix('masterEdition')}.maxSupply`)}
          />
        </Stack>
      </AccordionItem>}

      <AccordionItem
        label="Community external plugins"
        description={`Add custom functionality to your ${type}`}
        id="external"
        disabled
      >
        <Stack>
          <Text size="sm">Pick from a library of existing community plugins.</Text>
          <Text size="sm">Coming soon...</Text>
        </Stack>
      </AccordionItem>

    </Accordion>
  );
}
