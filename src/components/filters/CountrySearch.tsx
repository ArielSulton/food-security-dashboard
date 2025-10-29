'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Country } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { getClusterColor } from '@/lib/utils';

interface CountrySearchProps {
  countries: Country[];
  onSelect?: (country: Country | null) => void;
}

export function CountrySearch({ countries, onSelect }: CountrySearchProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Sort countries alphabetically
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  const handleSelect = (country: Country) => {
    const newSelection = selectedCountry?.name === country.name ? null : country;
    setSelectedCountry(newSelection);
    setOpen(false);
    onSelect?.(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span>{selectedCountry.name}</span>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: getClusterColor(selectedCountry.cluster),
                  color: 'white'
                }}
              >
                C{selectedCountry.cluster}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Cari negara...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Cari negara..." />
          <CommandEmpty>Negara tidak ditemukan.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {sortedCountries.map((country) => (
                <CommandItem
                  key={country.name}
                  value={country.name}
                  onSelect={() => handleSelect(country)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCountry?.name === country.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{country.name}</span>
                    <Badge
                      variant="secondary"
                      className="ml-2"
                      style={{
                        backgroundColor: getClusterColor(country.cluster),
                        color: 'white'
                      }}
                    >
                      {country.cluster}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
