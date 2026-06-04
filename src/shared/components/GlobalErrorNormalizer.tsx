import { AlertCircle } from 'lucide-react';
import { getErrorMessage } from '@/shared/lib/errors';

export function GlobalErrorNormalizer({ error }: { error: unknown }) {
  if (!error) return null;

  const msg = getErrorMessage(error, 'An unexpected error occurred');
  const code =
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'error' in error.response.data &&
    typeof error.response.data.error === 'object' &&
    error.response.data.error !== null &&
    'code' in error.response.data.error
      ? String(error.response.data.error.code)
      : null;

  return (
    <div className="my-4 flex items-start gap-3 rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{msg}</p>
        {code && <p className="mt-1 text-xs opacity-80">Error code: {code}</p>}
      </div>
    </div>
  );
}
