import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormSubmit } from './form-button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import * as Sentry from "@sentry/browser";
import { useToast } from '../ui/use-toast';

export const ReportError = ({
  tags
}: {
  tags?: Record<string, string>
}) => {
  const { toast } = useToast();
  
  const reportErrorSchema = z.object({
    name: z.string(),
    email: z.union([z.string().email(), z.literal('')]),
    message: z.string().min(2, {
      message: 'Bitte gib eine Nachricht ein.'
    })
  });
  const form = useForm<z.infer<typeof reportErrorSchema>>({
    resolver: zodResolver(reportErrorSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof reportErrorSchema>) => {
    const eventId = Sentry.lastEventId() || Sentry.captureMessage("User Feedback");
    Sentry.captureFeedback({
      ...data,
      associatedEventId: eventId,
    }, {
      captureContext: {
        tags,
      }
    });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: 'Dein Feedback wurde erfolgreich übermittelt, danke.'
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        setIsOpen(false);
        form.reset();
        resolve({});
      }, 1000)
    })
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)} 
        className="cursor-pointer w-fit flex items-center space-x-2 px-4 py-2 text-destructive bg-red-100 border border-destructive rounded-2xl">
        <Mail className="w-3 h-3" />
        <span className="text-xs">Fehler melden</span>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl flex flex-col w-full gap-0 overflow-hidden p-8 rounded-3xl mobile:p-5">
        <DialogHeader className="text-left mb-4">
          <DialogTitle className="text-lg tablet:text-base">Fehler melden</DialogTitle>
          <DialogDescription>
            Dir ist etwas aufgefallen? Lass uns wissen, was wir besser machen können.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-2'
            onSubmit={form.handleSubmit(onSubmit)}
          >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="E-Mail Adresse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nachricht</FormLabel>
                  <FormControl>
                    <Textarea
                      className='min-h-[200px]'
                      placeholder="Deine Nachricht"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSubmit
              className="self-end w-fit h-10 px-4 text-sm tablet:mt-5 mobile:w-full mobile:self-auto"
            >
              Absenden
            </FormSubmit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  )
}