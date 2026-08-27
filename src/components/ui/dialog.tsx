'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Overlay>>;
}) {
  return <DialogPrimitive.Overlay ref={ref} className={cn(className)} {...props} />;
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

function DialogContent({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>>;
}) {
  return (
    <DialogPrimitive.Content ref={ref} className={cn(className)} {...props}>
      {children}
    </DialogPrimitive.Content>
  );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Title>>;
}) {
  return <DialogPrimitive.Title ref={ref} className={cn(className)} {...props} />;
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Description>>;
}) {
  return <DialogPrimitive.Description ref={ref} className={cn(className)} {...props} />;
}
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
