'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ className, variant, size, loading, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  if (loading) {
    props.children = (
      <>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        <span>Einen Moment...</span>
      </>
    );
    props.disabled = true;
  }
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
LoadingButton.displayName = LoadingButton.name;

function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <LoadingButton {...props} loading={isPending}>
      {children}
    </LoadingButton>
  );
}

export interface FormSubmitProps extends ButtonProps {}

const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const {
      formState: { isSubmitting },
    } = useFormContext();

    return (
      <LoadingButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        loading={isSubmitting}
        {...props}
        type='submit'
      />
    );
  },
);
FormSubmit.displayName = FormSubmit.name;

export interface FormButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
}

const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    { className, variant, size, onClick: _onClick, asChild = false, ...props },
    ref,
  ) => {
    const [loading, setLoading] = React.useState(false);

    const onClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        _onClick(e).finally(() => {
          setLoading(false);
        });
      },
      [_onClick],
    );

    return (
      <LoadingButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        loading={loading}
        {...props}
        variant='secondary'
        type='button'
        onClick={onClick}
      />
    );
  },
);
FormButton.displayName = FormButton.name;

export {
  LoadingButton,
  SubmitButton,
  FormSubmit,
  FormButton
}