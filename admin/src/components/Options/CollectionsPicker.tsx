import * as React from 'react';
import { useIntl } from 'react-intl';
import { Box, Flex, Button, Combobox, ComboboxOption, Typography, Tag } from '@strapi/design-system';
import { getTranslation } from '../../utils/getTranslation';

type OptionItem = {
  key: string;
  value: string;
  metadatas?: { intlLabel?: { id?: string; defaultMessage?: string } };
};

type CollectionsPickerProps = {
  name: string;
  value?: string[];
  onChange: (value: string[]) => void;
  options?: OptionItem[];
  disabled?: boolean;
  error?: string;
};

export const CollectionsPicker: React.FC<CollectionsPickerProps> = ({
  name,
  value,
  onChange,
  options = [],
  disabled,
}) => {
  const { formatMessage } = useIntl();
  const [selected, setSelected] = React.useState<string>('');
  const list = Array.isArray(value) ? value : [];

  const addSelected = () => {
    if (!selected) return;
    if (list.includes(selected)) return;
    onChange([...list, selected]);
    setSelected('');
  };

  const removeItem = (uid: string) => {
    onChange(list.filter((v) => v !== uid));
  };

  const labelAdd = formatMessage({
    id: getTranslation('options.typeCollections.actions.add'),
    defaultMessage: 'Add',
  });

  return (
    <Box>
      <Flex gap={2} alignItems="flex-end">
        <Box style={{ flex: 1 }}>
          <Combobox
            value={selected}
            onChange={(val: string) => setSelected(val)}
            disabled={disabled}
            placeholder={formatMessage({
              id: getTranslation('options.typeCollections.placeholder'),
              defaultMessage: 'Select a collection type',
            })}
          >
            {(options || []).map((opt) => {
              const label = opt?.metadatas?.intlLabel?.defaultMessage || opt.value;
              return (
                <ComboboxOption key={opt.value} value={opt.value} textValue={label}>
                  {label}
                </ComboboxOption>
              );
            })}
          </Combobox>
        </Box>
        <Button onClick={addSelected} disabled={disabled || !selected}>
          {labelAdd}
        </Button>
      </Flex>

      <Box paddingTop={2}>
        {list.length === 0 ? (
          <Typography textColor="neutral500">
            {formatMessage({
              id: getTranslation('options.typeCollections.empty'),
              defaultMessage: 'No collection selected',
            })}
          </Typography>
        ) : (
          <Flex wrap="wrap" gap={2}>
            {list.map((uid) => (
              <Tag key={uid} onClose={() => removeItem(uid)}>
                {uid}
              </Tag>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
};


