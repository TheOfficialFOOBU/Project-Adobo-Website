'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>;
}) {
  return <TabsPrimitive.List ref={ref} className={cn(className)} {...props} />;
}
TabsList.displayName = TabsPrimitive.List.displayName;

function TabsTrigger({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>;
}) {
  return <TabsPrimitive.Trigger ref={ref} className={cn(className)} {...props} />;
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

function TabsContent({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Content>>;
}) {
  return <TabsPrimitive.Content ref={ref} className={cn(className)} {...props} />;
}
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
