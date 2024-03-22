import { Text, TextProps } from '@mantine/core';

export function LabelTitle(props: TextProps & { children: React.ReactNode }) {
  return <Text fz="xs" tt="uppercase" fw={700} c="dimmed" {...props}>{props.children}</Text>;
}
