'use client';

import { Check } from 'lucide-react';
import { Toast, ToastClose, ToastDescription, ToastTitle } from "./toast";
import { cn } from "@/lib/utils";

export function CustomToast({ className, ...props }: React.ComponentPropsWithoutRef<typeof Toast>) {
    return (
        <Toast
            {...props}
            className={cn(
                "rounded-xl shadow-lg border bg-white",
                "data-[state=open]:slide-in-from-top-full",
                "data-[state=closed]:fade-out-0",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                </div>
                <div className="grid gap-1">
                    {props.children}
                </div>
            </div>
            <ToastClose className="text-gray-400 hover:text-gray-500" />
        </Toast>
    );
}
