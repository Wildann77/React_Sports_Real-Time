import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useCreateCommentary } from '../hooks/use-commentary';
import { commentarySchema, CommentaryFormValues } from '../schemas/commentary.schema';
import { CommentaryEventTypeEnum, Match } from '@/shared/types/models';
import { Input, Button, Textarea } from '@/shared/ui';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/shared/ui/form';
import { ScoreBoardCompact } from '@/features/matches/components/ScoreBoardCompact';
import { getEventIcon, getEventColorClasses } from '@/shared/utils/event-meta';
import { getErrorMessage } from '@/shared/lib/errors';
import { CreateCommentaryPayload } from '../types';
import { toast } from 'sonner';
import { Card, CardContent } from '@/shared/ui/card';
import { Info, Timer, Award, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';

export function CreateCommentaryForm({ match }: { match: Match }) {
  const navigate = useNavigate();
  const minuteInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CommentaryFormValues>({
    resolver: zodResolver(commentarySchema),
    defaultValues: {
      minute: 0,
      eventType: CommentaryEventTypeEnum.INFO,
      message: '',
      homeScore: undefined,
      awayScore: undefined,
    },
  });

  const mutation = useCreateCommentary(match.id, {
    onSuccess: () => {
      toast.success('Commentary added successfully.');
      form.setValue('message', '');
      minuteInputRef.current?.focus();
      minuteInputRef.current?.select();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to add commentary.'));
    },
  });

  const onSubmit = (values: CommentaryFormValues) => {
    const payload: CreateCommentaryPayload = {
      minute: values.minute,
      eventType: values.eventType,
      message: values.message.trim(),
      payload: {},
    };

    if (typeof values.homeScore === 'number') {
      payload.payload.homeScore = values.homeScore;
    }

    if (typeof values.awayScore === 'number') {
      payload.payload.awayScore = values.awayScore;
    }

    mutation.mutate(payload);
  };

  const eventTypes = Object.values(CommentaryEventTypeEnum);
  const messageVal = form.watch('message') || '';
  const charCount = messageVal.length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Mini Scoreboard Header */}
      <ScoreBoardCompact match={match} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-xl">
            <CardContent className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {/* Minute */}
                <FormField
                  control={form.control}
                  name="minute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                        Minute
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="bg-secondary/40 border-border/60 font-mono"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          ref={(e) => {
                            field.ref(e);
                            minuteInputRef.current = e;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Home Score Update */}
                <FormField
                  control={form.control}
                  name="homeScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                        {match.homeTeam} Score
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder={`Current: ${match.homeScore}`}
                          className="bg-secondary/40 border-border/60 font-mono"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : Number(val));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Away Score Update */}
                <FormField
                  control={form.control}
                  name="awayScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                        {match.awayTeam} Score
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder={`Current: ${match.awayScore}`}
                          className="bg-secondary/40 border-border/60 font-mono"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : Number(val));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Event Type Grid Select */}
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-muted-foreground" />
                      Event Type
                    </FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {eventTypes.map((type) => {
                        const Icon = getEventIcon(type);
                        const colors = getEventColorClasses(type);
                        const isSelected = field.value === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={cn(
                              'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
                              isSelected
                                ? cn('shadow-sm scale-[1.02]', colors.bg, colors.text, colors.border)
                                : 'bg-card/40 border-border/40 hover:border-border hover:bg-card'
                            )}
                          >
                            <Icon className="h-5 w-5 stroke-[2.5]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-full">
                              {type.replace('-', ' ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the event..."
                        className="bg-secondary/40 border-border/60 pr-16"
                        {...field}
                      />
                    </FormControl>
                    <div className="absolute right-2 bottom-6 text-[9px] font-extrabold text-muted-foreground">
                      {charCount} / 250
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-xl border border-dashed border-border/40 bg-secondary/10 p-4 text-xs text-muted-foreground flex gap-2 items-start font-medium leading-relaxed">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Leave score fields empty if this commentary update should not affect the current score.</span>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="rounded-full font-semibold"
            >
              Done
            </Button>
            <Button
              type="submit"
              variant="success"
              className="rounded-full font-bold shadow-md cursor-pointer px-5 flex items-center justify-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mutation.isPending ? 'Sending...' : 'Post Commentary'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
