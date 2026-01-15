import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

interface ImageInputFieldProps {
  form: UseFormReturn<z.infer<any>>
  name: string
  placeholder?: string
  label?: string
  description?: string
  required?: boolean
  className?: string
  disabled?: boolean
  accept?: string
}

export const ImageInputField = ({
  form,
  name,
  placeholder,
  label,
  description,
  required,
  className,
  disabled,
  accept = "image/*",
}: ImageInputFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => {
        return (
          <FormItem>
            <FormLabel className="capitalize">
              {label}
              {required && label && <sup className="">*</sup>}
            </FormLabel>
            <div>
              <FormControl>
                <div className="group relative">
                  <Input
                    {...field}
                    type="file"
                    placeholder={placeholder}
                    accept={accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      onChange(file)
                    }}
                    disabled={disabled}
                    className={cn(
                      " rounded-sm group-aria-invalid:border-red-500 ",
                      className,
                    )}
                  />
                </div>
              </FormControl>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            {/* <FormMessage /> */}
          </FormItem>
        )
      }}
    />
  )
}