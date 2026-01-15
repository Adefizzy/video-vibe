import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

interface Props {
  form: UseFormReturn<z.infer<any>>
  name: string
  placeholder?: string
  label?: string
  description?: string
  required?: boolean
  type: string
  className?: string
  disabled?: boolean
  pattern?: string
  size?: number
}

export const TextField = ({
  form,
  name,
  placeholder,
  label,
  description,
  required,
  type,
  className,
  disabled,
  pattern,
  size,
}: Props) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
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
                    placeholder={placeholder}
                    type={type.toLowerCase()}
                    pattern={pattern}
                    size={size}
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
         {/*    <FormMessage /> */}
          </FormItem>
        )
      }}
    />
  )
}
