import { useState } from 'react';
import { format } from 'date-fns';
import { Key, PlusCircle, Trash2, KeyRound } from 'lucide-react';
import { useApiKeys, useDeleteApiKey } from '../hooks/use-api-keys';
import { CreateApiKeyDialog } from '../components/CreateApiKeyDialog';
import { ApiKeyStatusBadge } from '../components/ApiKeyStatusBadge';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { TableRowSkeleton } from '@/shared/components/TableRowSkeleton';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogFooter, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogAction, 
  AlertDialogCancel 
} from '@/shared/ui/alert-dialog';
import { getErrorMessage } from '@/shared/lib/errors';
import { toast } from 'sonner';
import { useDocumentTitle } from '@/shared/hooks';

export default function ApiKeysPage() {
  useDocumentTitle('API Key Management');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [revokeKeyId, setRevokeKeyId] = useState<number | null>(null);
  const [revokeKeyName, setRevokeKeyName] = useState<string>('');

  const { data: apiKeys, isLoading, isError, error, refetch } = useApiKeys();

  const deleteMutation = useDeleteApiKey({
    onSuccess: () => {
      toast.success('API key revoked successfully.');
      setRevokeKeyId(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to revoke API key.'));
    },
  });

  const handleRevokeConfirm = () => {
    if (revokeKeyId !== null) {
      deleteMutation.mutate(revokeKeyId);
    }
  };

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-5xl p-4">
        <ErrorState message={getErrorMessage(error, 'Failed to load API keys.')} retry={refetch} />
      </div>
    );
  }

  const keys = apiKeys || [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <PageHeader
        eyebrow="Integration"
        title="API Keys"
        description="Create and manage API keys to access matches and commentaries programmatically."
        action={
          <Button variant="success" className="rounded-full font-bold shadow-md cursor-pointer" onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-1.5 h-4 w-4" />
            New API Key
          </Button>
        }
      />

      {isLoading ? (
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-xl">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/40 bg-secondary/30 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Key prefix</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Scopes</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Last used</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <TableRowSkeleton key={idx} />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : keys.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border/40 bg-card/20 rounded-xl">
          <div className="relative rounded-full bg-primary/10 p-4 mb-4 border border-primary/20">
            <span className="absolute inset-0 rounded-full bg-primary/20 opacity-75 motion-safe:animate-ping" />
            <Key className="h-6 w-6 text-primary relative z-10" />
          </div>
          <h3 className="text-lg font-bold font-display mb-1.5">No API keys</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6 font-medium leading-relaxed">
            You haven't created any API keys yet. Create a key to start integrating your application.
          </p>
          <Button variant="success" className="rounded-full font-bold shadow-md cursor-pointer" onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Create your first key
          </Button>
        </Card>
      ) : (
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-primary/10 bg-secondary/30 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Key prefix</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Scopes</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Last used</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-card/60 transition-colors">
                    <td className="p-4 font-bold font-display text-foreground">
                      {key.name}
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground tracking-tight">
                      {key.keyPrefix}...{key.keyLastFour}
                    </td>
                    <td className="p-4">
                      <ApiKeyStatusBadge expiresAt={key.expiresAt} revokedAt={key.revokedAt} />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.map((scope) => (
                          <Badge key={scope} variant="outline" className="text-[10px] font-bold tracking-tight bg-secondary/30 border-border/60">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs font-semibold">
                      {key.expiresAt ? format(new Date(key.expiresAt), 'MMM d, yyyy') : 'Never'}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs font-semibold">
                      {key.lastUsedAt ? format(new Date(key.lastUsedAt), 'MMM d, yyyy p') : 'Never'}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setRevokeKeyId(key.id);
                          setRevokeKeyName(key.name);
                        }}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 rounded-full text-red-500 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                        aria-label={`Revoke API key ${key.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Radical AlertDialog for revocation confirmation */}
      <AlertDialog 
        open={revokeKeyId !== null} 
        onOpenChange={(val) => {
          if (!val) setRevokeKeyId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-2">
              <KeyRound className="h-5 w-5" />
            </div>
            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the API key <span className="font-semibold text-foreground">"{revokeKeyName}"</span>? 
              This action cannot be undone and any application using this key will immediately lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRevokeConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Revoking...' : 'Revoke Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateApiKeyDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
