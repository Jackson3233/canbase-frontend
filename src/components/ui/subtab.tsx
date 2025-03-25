"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const SubTabs = TabsPrimitive.Root;

const SubTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "w-full h-auto overflow-x-auto flex justify-start gap-2 py-3",
      className
    )}
    {...props}
  />
));
SubTabsList.displayName = TabsPrimitive.List.displayName;

const SubTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 py-1",
      "text-sm text-gray-500",
      "rounded-[10px] border border-dashed border-gray-200",
      "outline-none focus:outline-none",
      "transition-colors duration-200",
      "data-[state=active]:border-solid data-[state=active]:border-[#00C978] data-[state=active]:text-[#00C978] data-[state=active]:bg-[#00C978]/[0.10]",
      "hover:border-gray-300 hover:bg-gray-50",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
));
SubTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const SubTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
SubTabsContent.displayName = TabsPrimitive.Content.displayName;

const SubTabsSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="none"
    data-orientation="vertical"
    className={cn("mx-2 h-4 w-px bg-gray-200", className)}
    {...props}
  />
));
SubTabsSeparator.displayName = "SubTabsSeparator";

export { SubTabs, SubTabsList, SubTabsTrigger, SubTabsContent, SubTabsSeparator };
