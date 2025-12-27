export type ComboboxItem = {
  value: string;
  label: string;
};

export interface ComboboxProps {
  items: ComboboxItem[];
  placeholder: string;
  value: string | null;
  setValue: (value: string) => void;
}

