"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Search, MessageCircleMore, Settings } from 'lucide-react';

interface CommandDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandDialogContext = createContext<CommandDialogContextType | undefined>(undefined);

export function CommandDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialogContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Suche nach Schnellaktionen..." />
        <CommandList>
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
          <CommandGroup heading="Schnellaktionen">
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Suchen</span>
              <CommandShortcut>/</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <MessageCircleMore className="mr-2 h-4 w-4" />
              <span>Chat öffnen</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Einstellungen">
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Einstellungen öffnen</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandDialogContext.Provider>
  );
}

export function useCommandDialog() {
  const context = useContext(CommandDialogContext);
  if (context === undefined) {
    throw new Error('useCommandDialog must be used within a CommandDialogProvider');
  }
  return context;
}
