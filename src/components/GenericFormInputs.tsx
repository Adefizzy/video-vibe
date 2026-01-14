import type { FC } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'
import { TextField } from './TextField'
import { SelectInputField } from './SelectInputField'
import { PasswordField } from './PasswordField'
import { InputEnum } from '@/_shared/constants'
import { ColorPicker } from './ColorPickerField'
import { de } from 'zod/v4/locales'
import { TimeField } from './TimeField'

type IForm = { form: UseFormReturn<z.infer<any>, any, any> }
const GenericFormInputs: FC<FormInputProps & IForm> = ({
  form,
  type,
  label,
  required = false,
  placeholder,
  description,
  name,
  options,
  disabled,
  className,
  labelStyle,
  pattern, 
  size,
  defaultValue,
  videoDuration
}) => {
  switch (type) {
    case InputEnum.TEXT:
    case InputEnum.URL:
    case InputEnum.NUMBER:
      return (
        <TextField
          form={form}
          name={name}
          placeholder={placeholder}
          label={label}
          description={description}
          required={required}
          type={type}
          disabled={disabled}
          className={className}
          pattern={pattern}
          size={size}
        />
      )
    case InputEnum.PASSWORD:
      return (
        <PasswordField
          form={form}
          name={name}
          placeholder={placeholder}
          label={label}
          description={description}
          required={required}
        />
      )
    case InputEnum.SELECT:
      return (
        <SelectInputField
          form={form}
          name={name}
          placeholder={placeholder}
          label={label}
          description={description}
          required={required}
          type={type}
          options={options ?? []}
          className={className}
        />
      )
      case InputEnum.COLOR_PICKER:
      return (
        <ColorPicker
          form={form}
          name={name}
          placeholder={placeholder}
          label={label}
          description={description}
          required={required}
          type={type}
          className={className}
          defaultValue={defaultValue}
        />
      )
      case InputEnum.TIME:
        return (
          <TimeField
            form={form}
            name={name}
            label={label ?? ""}
            videoDuration={videoDuration ?? 0}
          />
        ) 
    default:
      return null
  }
}

export default GenericFormInputs
