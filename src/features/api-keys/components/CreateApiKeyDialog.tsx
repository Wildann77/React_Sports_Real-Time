import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Copy, Check, X, Key, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/shared/ui/form';
import { ScopeToggle } from './ScopeToggle';
import { apiKeySchema, ApiKeyFormValues } from '../schemas/api-key.schema';
import { useCreateApiKey } from '../hooks/use-api-keys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/errors';
import { cn } from '@/shared/utils';

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateApiKeyDialog({ open, onOpenChange }: CreateApiKeyDialogProps) {
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      scopes: [],
      expiresAt: '',
    },
  });

  const selectedScopes = form.watch('scopes') || [];

  const mutation = useCreateApiKey({
    onSuccess: (data) => {
      setCreatedKey(data.apiKey);
      toast.success('API key created successfully.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create API key.'));
    },
  });

  const handleScopeChange = (scope: string, checked: boolean) => {
    if (checked) {
      form.setValue('scopes', [...selectedScopes, scope], { shouldValidate: true });
    } else {
      form.setValue(
        'scopes',
        selectedScopes.filter((s) => s !== scope),
        { shouldValidate: true }
      );
    }
  };

  const onSubmit = (values: ApiKeyFormValues) => {
    mutation.mutate({
      name: values.name,
      scopes: values.scopes,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
    });
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      toast.success('Copied API key to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy API key.');
    }
  };

  const handleClose = () => {
    form.reset();
    setCreatedKey(null);
    onOpenChange(false);
  };

  return (
    <Dialog.Root 
      open={open} 
      onOpenChange={(val) => {
        if (!val) {
          handleClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-border/40 bg-background/95 backdrop-blur-md p-6 shadow-2xl duration-200 focus:outline-none">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <Dialog.Title className="text-lg font-bold font-display flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <span>{createdKey ? 'API Key Created' : 'Create New API Key'}</span>
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <div className="py-4">
            {createdKey ? (
              <div className="space-y-4">
                <div className="rounded-xl border bg-amber-500/10 p-4 text-sm text-amber-500 border-amber-500/20 flex gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold font-display">Copy this key now!</p>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                      For security reasons, you won't be able to see this key again. If you lose it, you will have to revoke it and create a new one.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revealed-key" className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                    API Key Secret
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="revealed-key"
                      readOnly
                      value={createdKey}
                      className="font-mono text-sm select-all bg-secondary/60 border-border/60"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleCopy}
                      className="rounded-lg shrink-0"
                      aria-label="Copy API Key"
                    >
                      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="button" variant="success" className="rounded-full px-6 font-bold" onClick={handleClose}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* Name field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                          Key Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Production Match Sync" 
                            className="bg-secondary/40 border-border/60"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Scopes field */}
                  <FormField
                    control={form.control}
                    name="scopes"
                    render={() => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                          Permissions
                        </FormLabel>
                        <div className="space-y-2">
                          <ScopeToggle
                            scope="matches:write"
                            description="Allows creating, updating, and deleting matches."
                            checked={selectedScopes.includes('matches:write')}
                            onChange={(checked) => handleScopeChange('matches:write', checked)}
                          />
                          <ScopeToggle
                            scope="commentary:write"
                            description="Allows creating and managing commentary items."
                            checked={selectedScopes.includes('commentary:write')}
                            onChange={(checked) => handleScopeChange('commentary:write', checked)}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expiration date */}
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          Expiration Date (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            className="bg-secondary/40 border-border/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Footer buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleClose}
                      className="rounded-full font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="success"
                      className="rounded-full font-bold shadow-md cursor-pointer px-5"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? 'Creating...' : 'Create API Key'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export default CreateApiKeyDialog;
