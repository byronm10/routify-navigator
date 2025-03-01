
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Company {
  id: string;
  name: string;
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: string | null;
  onSelectCompany: (companyId: string) => void;
}

export const CompanySelector = ({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompanySelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedCompanyName = selectedCompany
    ? companies.find((company) => company.id === selectedCompany)?.name
    : "Seleccionar empresa";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {selectedCompanyName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar empresa..." />
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup>
            {companies.map((company) => (
              <CommandItem
                key={company.id}
                value={company.id}
                onSelect={() => {
                  onSelectCompany(company.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCompany === company.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {company.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
