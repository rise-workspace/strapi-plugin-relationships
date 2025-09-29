import { MessageDescriptor, IntlShape } from 'react-intl';
import { getTranslation } from './getTranslation';

export type EntryStatus = 'published' | 'draft' | 'modified';

export type EntryStatusMeta = {
  publishedAt?: string | null;
  hasDraftAndPublish?: boolean;
  isDirty?: boolean;
};

export type EntryStatusResult = {
  status: EntryStatus;
  isPublished: boolean;
  label: string;
  color: string; // design-system token, e.g., 'success600' | 'neutral600' | 'warning600'
};

const STATUS_TO_COLOR: Record<EntryStatus, string> = {
  published: 'success600',
  draft: 'neutral600',
  modified: 'warning600',
};

const STATUS_TO_I18N: Record<EntryStatus, MessageDescriptor> = {
  published: {
    id: getTranslation('status.published'),
    defaultMessage: 'Published',
  },
  draft: {
    id: getTranslation('status.draft'),
    defaultMessage: 'Draft',
  },
  modified: {
    id: getTranslation('status.modified'),
    defaultMessage: 'Modified',
  },
};

export function buildEntryStatus(intl: IntlShape, entry: any): EntryStatusResult {
  const rawStatus = entry?.status as EntryStatus | undefined;
  const status: EntryStatus = rawStatus ?? (entry?.publishedAt ? 'published' : 'draft');

  const isPublished = status === 'published';

  return {
    status,
    isPublished,
    label: intl.formatMessage(STATUS_TO_I18N[status]),
    color: STATUS_TO_COLOR[status],
  };
}
