import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface SelectFieldProps {
  form: UseFormReturn<z.infer<any>>
  options: { value: string; label: string }[]
  label?: string
  defaultValue?: string
  placeholder?: string
  className?: string
  name: string
  description?: string
  required?: boolean
  type?: string
}
export function SelectInputField(props: SelectFieldProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {props.label} {props.required && <sup className="">*</sup>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <div className="group relative  overflow-clip max-w-96">
                <SelectTrigger className="h-12 rounded-sm group-aria-invalid:border-red-500 w-full">
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{props.defaultValue}</SelectLabel>
                {props.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
