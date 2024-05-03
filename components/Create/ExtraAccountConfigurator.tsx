import { Button, CloseButton, Group, Select, Stack, TextInput } from '@mantine/core';
import { ExtraAccountWithNoneInput, SeedInput } from '@/lib/type';
import { ExtraAccountSelector } from './ExtraAccountSelector';

export function ExtraAccountConfigurator({ label, extraAccount, setExtraAccount }: { label: string, extraAccount: ExtraAccountWithNoneInput, setExtraAccount: (extraAccount: ExtraAccountWithNoneInput) => void }) {
  return (
    <>
      <ExtraAccountSelector
        label={label}
        value={extraAccount.type}
        setValue={(type) => {
          if (type === 'Address') {
            setExtraAccount({ type, address: '' } as ExtraAccountWithNoneInput);
          } else if (type === 'CustomPda') {
            setExtraAccount({
              type,
              seeds: [{
                type: 'Asset',
              }],
            } as ExtraAccountWithNoneInput);
          } else {
            setExtraAccount({ type } as ExtraAccountWithNoneInput);
          }
        }}
      />
      {extraAccount.type === 'Address' && <TextInput label="Address" value={extraAccount.address} onChange={(e) => setExtraAccount({ type: 'Address', address: e.currentTarget.value })} />}
      {extraAccount.type === 'CustomPda' && (
        <Stack ml="lg">
          {extraAccount.seeds?.map((seed, idx) => (
            <>
              <Group>
                <Select
                  data={['Asset', 'Address', 'Bytes', 'Collection', 'Owner', 'Recipient']}
                  value={seed.type}
                  onChange={(value) => {
                    const newSeeds = [...extraAccount.seeds];
                    newSeeds[idx] = { type: value } as any;
                    setExtraAccount({ ...extraAccount, seeds: newSeeds });
                  }}
                />
                <CloseButton
                  onClick={() => {
                    const newSeeds = [...extraAccount.seeds];
                    newSeeds.splice(idx, 1);
                    setExtraAccount({ ...extraAccount, seeds: newSeeds });
                  }}
                />
              </Group>
              {seed.type === 'Address' && <TextInput
                label="Address"
                value={seed.pubkey}
                onChange={(e) => {
                  const newSeeds = [...extraAccount.seeds];
                  (newSeeds[idx] as Extract<SeedInput, { type: 'Address' }>).pubkey = e.currentTarget.value;
                  setExtraAccount({ ...extraAccount, seeds: newSeeds });
                }}
              />}
            </>
          ))}
          <span>
            <Button
              variant="subtle"
              onClick={() => {
                setExtraAccount({
                  ...extraAccount,
                  seeds: [...(extraAccount.seeds || []), { type: 'Asset' }],
                });
              }}
            >
              + Add seed
            </Button>
          </span>
        </Stack>
      )}
    </>
  );
}
