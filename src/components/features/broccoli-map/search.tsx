"use client";

import { useCallback, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Command, CommandLoadingInput, CommandItem, CommandList } from '@/components/ui/command';
import { debounce, map, uniqBy } from 'lodash';
import { CollapsibleBroccoliMapControlContainer } from './control-button';
import { ArrowLeftToLine, Search } from 'lucide-react';
import zoomLevels from './zoom-levels.json';

export type BroccoliMapSearchItem = {
  x: number,
  y: number,
  label: string,
  zoom?: number,
  raw?: any
};

export const BroccoliMapSearch = ({
  onSelect
}: {
  onSelect?: (item: BroccoliMapSearchItem) => void;
}) => {
  const provider = new OpenStreetMapProvider();
  const [results, setResults] = useState<Array<BroccoliMapSearchItem>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState<string>();

  const attachZoomLevel = (items: Array<BroccoliMapSearchItem>) => {
    return map(items, i => ({
      ...i,
      zoom: i.raw?.addresstype ? zoomLevels[i.raw?.addresstype as keyof typeof zoomLevels] : undefined
    })) as Array<BroccoliMapSearchItem>;
  }

  const unify =  (items: Array<BroccoliMapSearchItem>) => {
    return uniqBy(items, i => i.label);
  }

  const search = debounce((query?: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    provider.search({
      query: `${query},Deutschland`
    })
      .then(attachZoomLevel)
      .then(unify)
      .then(setResults)
      .catch(e => {
        // TODO post to sentry
        console.error(e);
      })
      .finally(() => setIsSearching(false));
  }, 1000);

  const handleValueChange = useCallback((query?: string) => {
    setValue(query);
    search(query);
  }, [setValue]);

  const select = useCallback((item: BroccoliMapSearchItem) => {
    setResults([]);
    setValue(item.label);
    onSelect?.(item);
  }, [onSelect]);

  return (
    <CollapsibleBroccoliMapControlContainer
      collapsedIcon={Search}
      expandedIcon={ArrowLeftToLine}
      horizontal>
      <Command className='w-[min(calc(100cqw-75px),550px)]' shouldFilter={false}>
        <CommandLoadingInput className="pr-[30px]" isLoading={isSearching} value={value} onValueChange={handleValueChange} placeholder="Suche einen Ort..." />
        <CommandList>
          {results.map((item) => (
            <CommandItem onSelect={() => select(item)} key={item.label}>
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </CollapsibleBroccoliMapControlContainer>
  )
}