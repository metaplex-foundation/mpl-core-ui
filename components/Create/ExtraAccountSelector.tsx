import { Combobox, Input, InputBase, Text, useCombobox } from '@mantine/core';

interface Item {
  title: string;
  // eslint-disable-next-line react/no-unused-prop-types
  value: string;
  description: string;
}

const items: Item[] = [
  { title: 'None', value: 'None', description: 'A static account specified by the Base Address' },
  { title: 'Preconfigued Asset PDA', value: 'PreconfiguredAsset', description: 'A preconfigured PDA with seeds [<Base address>, "mpl-core", <Asset address>]' },
  { title: 'Preconfigured Collection PDA', value: 'PreconfiguredCollection', description: 'A preconfigured PDA with seeds [<Base address>, "mpl-core", <Collection address>]' },
  { title: 'Preconfigured Owner PDA', value: 'PreconfiguredOwner', description: 'A preconfigured PDA with seeds [<Base address>, "mpl-core", <current Asset owner>]' },
  { title: 'Preconfigured Recipient PDA', value: 'PreconfiguredRecipient', description: 'A preconfigured PDA with seeds [<Base address>, "mpl-core", <intended recipient of a transfer>]' },
  { title: 'Preconfigured Program PDA', value: 'PreconfiguredProgram', description: 'A preconfigured PDA with seeds [<Program address>, "mpl-core"' },
  { title: 'Address', value: 'Address', description: 'A static address' },
  { title: 'Custom PDA', value: 'CustomPda', description: 'Define a custom PDA with your own seed array with custom tokens' },

];

function SelectOption({ description, title }: Item) {
  return (
    <div>
      <Text fz="sm" fw={500}>
        {title}
      </Text>
      <Text fz="xs" opacity={0.6}>
        {description}
      </Text>
    </div>
  );
}

export function ExtraAccountSelector({ value, setValue, label }: { label: string, value: string, setValue: (value: string) => void }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedOption = items.find((item) => item.value === value);

  const options = items.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {selectedOption ? (
            <SelectOption {...selectedOption} />
          ) : (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
