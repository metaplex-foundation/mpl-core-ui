import { Anchor, Badge, Box, Group, Text } from '@mantine/core';
import { CopyButton } from '../CopyButton/CopyButton';
import RetainQueryLink from '../RetainQueryLink';

import classes from './ExplorerStat.module.css';

export type ExplorerStatProps = {
  label: string
  value: string
  copyable?: boolean
  labeled?: boolean
  asExternalLink?: string
  asNativeLink?: string
};

function LabelValue({ children }: { children: React.ReactNode }) {
  return (
    <Text fz="sm" fw={500} className={classes.statText}>
      {children}
    </Text>
  );
}

export function ExplorerStat({ label, value, copyable, labeled, asExternalLink, asNativeLink }: ExplorerStatProps) {
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
        <>
          {asNativeLink ? (
            <RetainQueryLink
              href={asNativeLink}
              style={{
                textDecoration: 'none',
              }}
            >
              <LabelValue>
                {value}
              </LabelValue>
            </RetainQueryLink>
          ) : asExternalLink ? (
            <Anchor href={asExternalLink} target="_blank">
              <LabelValue>
                {value}
              </LabelValue>
            </Anchor>
          ) : (

            <LabelValue>
              {value}
            </LabelValue>
          )}
        </>
      )}

    </Box>
  );
}
