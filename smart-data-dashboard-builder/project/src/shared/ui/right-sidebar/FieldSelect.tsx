import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

type FieldSelectProps = {
  label: string;
  value?: string;
  options: string[];
  search?: boolean;
  onChange: (value: string) => void;
};

export function FieldSelect({ label, value, options, search, onChange }: FieldSelectProps) {
  if (search) {
    return (
      <Autocomplete
        size="small"
        options={options}
        value={value ?? null}
        onChange={(_event, selected) => {
          if (selected) onChange(selected);
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    );
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value ?? ''}
        onChange={(event) => onChange(String(event.target.value))}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
