import type { UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Input } from "./ui/input";
import { cn } from "../lib/utils";
import { PasswordInput } from "./PasswordInput";

type Props = {
  form: UseFormReturn<z.infer<any>, any, any>;
  name: string;
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  //type: string;
};

export const PasswordField = ({
  form,
  name,
  placeholder,
  label,
  description,
  required,
  //type,
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
              {required && label &&  <sup className="">*</sup>}
            </FormLabel>
            <div>
              <FormControl>
                <div className="group relative">
                  <PasswordInput
                    {...field}
                    placeholder={placeholder}
                    className=" h-12  rounded-sm group-aria-[invalid='true']:border-red-500 "
                  />
                </div>
              </FormControl>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
