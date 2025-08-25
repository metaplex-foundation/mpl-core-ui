import { Button, Collapse, Group, Text } from '@mantine/core';
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core';
import { useState } from 'react';
import { LabelTitle } from '../LabelTitle';

// Helper function to get schema label
export const getSchemaLabel = (schema?: ExternalPluginAdapterSchema): string => {
  if (schema === undefined || schema === null) return 'Unknown';
  switch (schema) {
    case ExternalPluginAdapterSchema.Binary:
      return 'Binary';
    case ExternalPluginAdapterSchema.Json:
      return 'JSON';
    case ExternalPluginAdapterSchema.MsgPack:
      return 'MsgPack';
    default:
      return 'Unknown';
  }
};

// Helper function to format data based on schema
export const formatDataBySchema = (data: any, schema?: ExternalPluginAdapterSchema): string => {
  if (!data) return 'No data';

  try {
    if (schema === ExternalPluginAdapterSchema.MsgPack || schema === ExternalPluginAdapterSchema.Json) {
      return JSON.stringify(data, null, 2);
    }

    // For binary or unknown schema, display as hex
    if (data instanceof Uint8Array) {
      return Array.from(data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
    }

    // Fallback to string representation
    return typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
  } catch (error) {
    return 'Error formatting data';
  }
};

export interface CollapsibleDataDisplayProps {
  data: any;
  schema?: ExternalPluginAdapterSchema;
  title?: string;
}

// Collapsible data display component
export const CollapsibleDataDisplay = ({
  data,
  schema,
  title = 'Data',
}: CollapsibleDataDisplayProps) => {
  const [opened, setOpened] = useState(false);

  if (!data) return null;

  const formattedData = formatDataBySchema(data, schema);

  return (
    <div>
      <Group justify="space-between" mb="xs">
        <LabelTitle>{title}</LabelTitle>
        <Button
          size="xs"
          variant="subtle"
          onClick={() => setOpened(!opened)}
        >
          {opened ? 'Hide' : 'Show'} Data
        </Button>
      </Group>
      <Collapse in={opened}>
        <Text
          fz="sm"
          style={{
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#202020',
            padding: '8px',
            borderRadius: '4px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {formattedData}
        </Text>
      </Collapse>
    </div>
  );
};
