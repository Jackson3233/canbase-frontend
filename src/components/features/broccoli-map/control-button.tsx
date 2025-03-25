"use client";

import { Button, ButtonProps } from '@/components/ui/button';
import { cnWithBorder } from './utils';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, LucideIcon } from 'lucide-react';
import React from 'react';

const BroccoliMapControlButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cnWithBorder('p-0 rounded-xl bg-white hover:bg-[#f4f4f4]', className)}
        ref={ref}
        {...props}>
      </Button>
    )
  }
);
BroccoliMapControlButton.displayName = 'BroccoliMapControlButton';
export {
  BroccoliMapControlButton
}

export const CollapsibleBroccoliMapControlButton = ({ 
  children, 
  className, 
  size,
  collapsedIcon: CollapsedIcon = ArrowUpRight,
  expandedIcon: ExpandedIcon = ArrowDownLeft,
  horizontal = false,
  ...buttonProps 
}: Omit<ButtonProps, 'size'> & {
  size?: string;
  collapsedIcon?: LucideIcon;
  expandedIcon?: LucideIcon;
  horizontal?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BroccoliMapControlButton 
      {...buttonProps}
      style={{
        '--control-button-size': size || '43px'
      } as React.CSSProperties}
      className={cn(className, 'overflow-hidden transition-[height] transition-[width] flex flex-col justify-start items-end', {
        'h-[var(--control-button-size)] w-[var(--control-button-size)]': !!isCollapsed,
        'h-min w-min': !isCollapsed,
        'flex-row-reverse items-start': horizontal
      })}
      onClick={() => setIsCollapsed(!isCollapsed)}>
      <div className="shrink-0 h-[calc(var(--control-button-size)-2px)] w-[calc(var(--control-button-size)-2px)] flex justify-center items-center">
        {isCollapsed ? <CollapsedIcon size={20} color="black" /> : <ExpandedIcon size={20} color="black" />  }
      </div>
      <div>{children}</div>
    </BroccoliMapControlButton>
  )
}

export const CollapsibleBroccoliMapControlContainer = ({ 
  children, 
  className, 
  size = 43,
  collapsedIcon: CollapsedIcon = ArrowUpRight,
  expandedIcon: ExpandedIcon = ArrowDownLeft,
  horizontal = false,
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
  collapsedIcon?: LucideIcon;
  expandedIcon?: LucideIcon;
  horizontal?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      style={{
        '--control-button-size': `${size}px`,
        '--control-button-size-expanded': `${size-15}px`,
      } as React.CSSProperties}
      className={cnWithBorder(className, 'rounded-xl overflow-hidden transition-[height] transition-[width] flex flex-col justify-start items-end', {
        'h-[var(--control-button-size)] w-[var(--control-button-size)]': !!isCollapsed,
        'h-min w-min': !isCollapsed,
        'flex-row-reverse items-start': horizontal
      })}>
      <Button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant={isCollapsed ? 'default' : 'outline'}
        className={cn('shrink-0 h-[calc(var(--control-button-size)-2px)] w-[calc(var(--control-button-size)-2px)] p-0 bg-white hover:bg-[#f4f4f4]', {
          'absolute right-[9px] top-[9px] h-[calc(var(--control-button-size-expanded)-4px)] w-[calc(var(--control-button-size-expanded)-4px)]': !isCollapsed,
        })}>
        {isCollapsed ? <CollapsedIcon size={20} color="black" /> : <ExpandedIcon size={15} color="black" />  }
      </Button>
      <div>{children}</div>
    </div>
  )
}
