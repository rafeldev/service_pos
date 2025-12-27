"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import type { ComboboxProps } from "@/app/types/components/comboboxTypes";

export function ComboboxDemo({ items, placeholder, value, setValue }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[45px] justify-between rounded-sm"
        >
          <div className="flex items-center gap-2">
          <SearchIcon className="w-4 h-4 opacity-50" />
          {value
            ? items?.find((item) => item?.value === value)?.label
            : placeholder}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty className="flex flex-col gap-4 items-center justify-center">
              <p className="text-sm text-gray-500 mt-4">No se encontraron resultados.</p>
            <Button variant="outline" size="sm" onClick={() => {
              setOpen(false)
              router.push(`/settings`)
              //TODO: validar si tiene items en la tabla no dejar redirigir
              //validar mas adelante si se crea el itemd desde aqui
            }}>
              <PlusIcon className="w-4 h-4" />
              Crear nuevo
            </Button>
            </CommandEmpty>
            <CommandGroup>
              {items?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    console.log(currentValue, 'currentValue');
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
