import { Box, Group, Text } from '@mantine/core';
import { CopyButton } from '../CopyButton/CopyButton';

export function ExplorerStat({ label, value, copyable }: { label: string; value: string, copyable?: boolean }) {
  return (
    <Box>
      <Group gap="xs">
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          {label}
        </Text>
        {copyable && <CopyButton value={value} />}
      </Group>
      <Text fz="lg" fw={500}>
        {value}
      </Text>

    </Box>
  );
}
