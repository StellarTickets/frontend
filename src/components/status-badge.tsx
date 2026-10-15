import type { EventStatus, TicketStatus } from '@/lib/types';

type Status = TicketStatus | EventStatus;

export const STATUS_STYLES: Record<Status, string> = {
  VALID: 'text-success border-success/30 bg-success/10',
  USED: 'text-warning border-warning/30 bg-warning/10',
  REVOKED: 'text-danger border-danger/30 bg-danger/10',
  RESALE: 'text-info border-info/30 bg-info/10',
  DRAFT: 'text-warning border-warning/30 bg-warning/10',
  PUBLISHED: 'text-success border-success/30 bg-success/10',
  CANCELLED: 'text-danger border-danger/30 bg-danger/10',
};

export const STATUS_LABELS: Record<Status, string> = {
  VALID: 'Valid',
  USED: 'Used',
  REVOKED: 'Revoked',
  RESALE: 'Listed for resale',
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CANCELLED: 'Cancelled',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
