import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface ApiKeyStatusBadgeProps {
  expiresAt: string | null;
  revokedAt?: string | null;
}

export const ApiKeyStatusBadge: React.FC<ApiKeyStatusBadgeProps> = ({ expiresAt, revokedAt }) => {
  if (revokedAt) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 font-semibold">
        <XCircle className="w-3.5 h-3.5" /> Revoked
      </Badge>
    );
  }

  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    
    if (expiryDate < now) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 font-semibold">
          <XCircle className="w-3.5 h-3.5" /> Expired
        </Badge>
      );
    }
    
    const daysLeft = differenceInDays(expiryDate, now);
    if (daysLeft < 7) {
      return (
        <Badge variant="warning" className="flex items-center gap-1 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" /> Expires soon
        </Badge>
      );
    }
  }

  return (
    <Badge variant="success" className="flex items-center gap-1 font-semibold">
      <CheckCircle className="w-3.5 h-3.5" /> Active
    </Badge>
  );
};
export default ApiKeyStatusBadge;
