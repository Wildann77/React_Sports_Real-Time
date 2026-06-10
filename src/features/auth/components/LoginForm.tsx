import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useLoginMutation } from '../hooks/use-auth-mutations';
import { loginSchema, LoginFormValues } from '../schemas/auth.schema';
import { Input, Button } from '@/shared/ui';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/shared/ui/form';
import { BrandLogo } from '@/shared/components/BrandLogo';
import { Backdrop } from '@/shared/components/Backdrop';
import { getErrorMessage } from '@/shared/lib/errors';
import { Mail, Lock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useDocumentTitle } from '@/shared/hooks';

export function LoginForm() {
  useDocumentTitle('Admin Login');
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useLoginMutation({
    onSuccess: () => {
      toast.success('Successfully logged in.');
      navigate('/admin');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Login failed. Please check your credentials.'));
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  const benefits = [
    'Real-time scores & commentaries',
    'Instant match details management',
    'Programmatic scoping for API keys',
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-1 w-full overflow-hidden items-center justify-center p-0">
      <Backdrop />

      <div className="relative z-10 w-full max-w-4xl bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Left Side: Brand Cover Panel (lg only) */}
        <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-primary/20 via-background/40 to-black relative overflow-hidden border-r border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(29,185,84,0.1),transparent_60%)] pointer-events-none" />
          
          <BrandLogo size="lg" />

          <div className="space-y-6">
            <h2 className="text-3xl font-black font-display tracking-tight text-foreground leading-tight">
              Control your live broadcast center.
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-muted-foreground font-semibold">
            &copy; {new Date().getFullYear()} Sports Dashboard Admin Panel.
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="flex flex-col justify-center p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            {/* Logo visible only on mobile */}
            <div className="lg:hidden mb-4">
              <BrandLogo size="md" />
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-foreground sm:text-3xl">
              Admin Login
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Enter your credentials below to access management tools.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          className="pl-10 bg-secondary/40 border-border/60"
                          autoFocus
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-secondary/40 border-border/60"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="success"
                size="xl"
                className="w-full font-bold shadow-md cursor-pointer mt-2 flex items-center justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mutation.isPending ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <span>Not an admin? View public scores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;
