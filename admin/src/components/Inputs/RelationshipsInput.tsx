import * as React from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Field,
  Combobox,
  ComboboxOption,
  Flex,
  Typography,
  Badge,
  Button,
} from '@strapi/design-system';
import { type InputProps, type FieldValue, useFetchClient } from '@strapi/strapi/admin';
import { getTranslation } from '../../utils/getTranslation';
import { buildEntryStatus } from '../../utils/buildStatus';

type RelationshipsInputProps = InputProps & FieldValue;

export const RelationshipsInput = React.forwardRef<HTMLElement, RelationshipsInputProps>(
  (props, ref) => {
    const {
      hint,
      disabled = false,
      labelAction,
      name,
      required = false,
      onChange,
      value,
      error,
    } = props;

    const relationType =
      ((props as any)?.attribute?.options?.relationType as 'oneToOne' | 'oneToMany') ?? 'oneToOne';

    const configuredCollections =
      ((props as any)?.attribute?.options?.targetCollections as string) || '';

    const intl = useIntl();
    const { formatMessage } = intl;
    const { get } = useFetchClient();

    const [result, setResult] = React.useState<string>(typeof value === 'string' ? value : '');
    const [options, setOptions] = React.useState<
      Array<{
        value: string;
        label: string;
        status: string;
        isPublished: boolean;
        badgeTextColor: string;
        badgeBgColor: string;
      }>
    >([]);
    const [collections, setCollections] = React.useState<Array<{ label: string; uid: string }>>([]);
    const [activeCollection, setActiveCollection] = React.useState<string>('');
    const [selectedItems, setSelectedItems] = React.useState<typeof options>([]);

    // Fetch collections and options
    React.useEffect(() => {
      let isMounted = true;
      const fetchTools = async () => {
        try {
          console.log(relationType);
          console.log(configuredCollections);
          const available: Array<{ label: string; uid: string }> = configuredCollections
            .split(';')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((item) => {
              const [labelPart, uidPart] = item.split(',');
              const uid = (uidPart || '').trim();
              const label = (labelPart || '').trim() || uid;
              return { label, uid };
            })
            .filter((it) => Boolean(it.uid));

          if (available.length === 0) throw new Error('No target collections configured');

          if (isMounted) {
            setCollections(available);
            setActiveCollection((prev) =>
              prev && available.some((c) => c.uid === prev) ? prev : available[0].uid
            );
          }

          const uid = available[0].uid;
          const response = await get(`/content-manager/collection-types/${uid}`, {
            params: { page: 1, pageSize: 100 },
          });
          const results = response?.data?.results ?? response?.data?.data ?? [];
          const mapped = (Array.isArray(results) ? results : []).map((entry: any) => {
            const label = entry?.name ?? entry?.title ?? String(entry?.id ?? '');
            const statusInfo = buildEntryStatus(intl, entry);
            const bgColor = statusInfo.color.replace('600', '200');
            return {
              value: String(entry?.id ?? ''),
              label,
              status: statusInfo.label,
              isPublished: statusInfo.isPublished,
              badgeTextColor: statusInfo.color,
              badgeBgColor: bgColor,
            };
          });
          if (isMounted) setOptions(mapped);
        } catch (e) {
          if (isMounted) setOptions([]);
        }
      };
      fetchTools();
      return () => {
        isMounted = false;
      };
    }, [get]);

    // Refetch options when active collection changes
    React.useEffect(() => {
      let isMounted = true;
      const refetch = async () => {
        if (!activeCollection) return;
        try {
          const response = await get(`/content-manager/collection-types/${activeCollection}`, {
            params: { page: 1, pageSize: 100 },
          });
          const results = response?.data?.results ?? response?.data?.data ?? [];
          const mapped = (Array.isArray(results) ? results : []).map((entry: any) => {
            const label = entry?.name ?? entry?.title ?? String(entry?.id ?? '');
            const statusInfo = buildEntryStatus(intl, entry);
            const bgColor = statusInfo.color.replace('600', '200');
            return {
              value: String(entry?.id ?? ''),
              label,
              status: statusInfo.label,
              isPublished: statusInfo.isPublished,
              badgeTextColor: statusInfo.color,
              badgeBgColor: bgColor,
            };
          });
          if (isMounted) setOptions(mapped);
        } catch {
          if (isMounted) setOptions([]);
        }
      };
      refetch();
      return () => {
        isMounted = false;
      };
    }, [activeCollection, get]);

    const onClearResult = () => {
      setResult('');
      onChange({
        target: { name, value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleOnChangeResult = (item: string) => {
      setResult(item);
    };

    const handleAddItem = () => {
      if (!result) return;
      const item = options.find((opt) => opt.value === result);
      if (!item) return;
      setSelectedItems((prev) => [...prev, item]);
      // Reset selects
      setResult('');
      if (collections.length > 1) setActiveCollection(collections[0].uid);
      // Trigger onChange with all selected ids
      onChange({
        target: {
          name,
          value: [...selectedItems.map((i) => i.value), item.value],
        },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleRemoveItem = (valueToRemove: string) => {
      const updated = selectedItems.filter((i) => i.value !== valueToRemove);
      setSelectedItems(updated);
      onChange({
        target: {
          name,
          value: updated.map((i) => i.value),
        },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <Box>
        <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
          <Field.Label action={labelAction}>
            {formatMessage({
              id: getTranslation('form.label.relationships'),
              defaultMessage: 'Relationships',
            })}
          </Field.Label>

          {collections.length > 1 && (
            <Combobox
              value={activeCollection}
              onChange={(uid: string) => setActiveCollection(uid)}
              disabled={disabled}
              required={required}
              placeholder={formatMessage({
                id: getTranslation('form.placeholders.select-collection'),
                defaultMessage: 'Select collection',
              })}
            >
              {collections.map((c) => (
                <ComboboxOption key={c.uid} value={c.uid} textValue={c.label}>
                  {c.label}
                </ComboboxOption>
              ))}
            </Combobox>
          )}

          <Flex gap={2} alignItems="center">
            <Combobox
              value={result}
              onChange={handleOnChangeResult}
              disabled={disabled}
              required={required}
              placeholder={formatMessage({
                id: getTranslation('form.placeholders.select-relationship'),
                defaultMessage: 'Select relationship type',
              })}
              style={{ flex: 1 }}
            >
              {options.map((opt) => (
                <ComboboxOption key={opt.value} value={opt.value} textValue={opt.label}>
                  <Flex justifyContent="space-between" alignItems="center" gap={2} width="100%">
                    <Typography flex={1}>{opt.label}</Typography>
                    <Badge
                      backgroundColor={opt.badgeBgColor}
                      textColor={opt.badgeTextColor}
                      style={{ textTransform: 'none' }}
                    >
                      {opt.status}
                    </Badge>
                  </Flex>
                </ComboboxOption>
              ))}
            </Combobox>

            <Button variant="secondary" onClick={handleAddItem} disabled={!result} size="L">
              {formatMessage({
                id: getTranslation('form.actions.add'),
                defaultMessage: 'Add',
              })}
            </Button>
          </Flex>

          {relationType === 'oneToMany' && selectedItems.length > 0 && (
            <Box marginTop={2}>
              {selectedItems.map((item) => (
                <Flex
                  key={item.value}
                  justifyContent="space-between"
                  alignItems="center"
                  padding={2}
                  border="1px solid #eaeaeb"
                  borderRadius="4px"
                  marginBottom={1}
                >
                  <Typography>{item.label}</Typography>
                  <Button
                    variant="danger-light"
                    onClick={() => handleRemoveItem(item.value)}
                    size="S"
                  >
                    {formatMessage({
                      id: getTranslation('form.actions.remove'),
                      defaultMessage: 'Remove',
                    })}
                  </Button>
                </Flex>
              ))}
            </Box>
          )}

          <Field.Hint />
          <Field.Error />
        </Field.Root>
      </Box>
    );
  }
);
