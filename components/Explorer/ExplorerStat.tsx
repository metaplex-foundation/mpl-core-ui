import { Badge, Box, Group, Text } from '@mantine/core';
import { CopyButton } from '../CopyButton/CopyButton';

export function ExplorerStat({ label, value, copyable, labeled }: { label: string; value: string, copyable?: boolean, labeled?: boolean }) {
  return (
    <Box>
      <Group gap="xs">
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          {label}
        </Text>
        {copyable && <CopyButton value={value} />}
      </Group>
      {labeled ? (
        <Badge variant="light">{value}</Badge>
      ) : (
        <Text fz="sm" fw={500}>
          {value}
        </Text>
      )}

    </Box>
  );
}
