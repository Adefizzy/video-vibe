import { InputEnum } from '@/_shared/constants'
import * as z from 'zod'

export const TextSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  borderColor: z.string().optional(),
  fontSize: z.string().optional(),
  fontFamily: z.string().optional(),
//  align: z.enum(['left', 'center', 'right', 'justify']).optional(),
})

export const LinkSchema = TextSchema.extend({
  url: z.string().regex(/^https:\/\/.*/, 'URL must start with https://'),
})

export type ITextSchema = z.infer<typeof TextSchema>
export type ILinkSchema = z.infer<typeof LinkSchema>

export const textInputs: FormInputProps[] = [
  {
    label: 'Content',
    name: 'content',
    required: true,
    placeholder: 'Enter your content',
    type: InputEnum.TEXT,
  },
  {
    label: 'Background Color',
    name: 'bgColor',
    required: false,
    placeholder: 'Pick a background color',
    type: InputEnum.COLOR_PICKER,
  },
  {
    label: 'Text Color',
    name: 'textColor',
    required: false,
    placeholder: 'Pick a text color',
    type: InputEnum.COLOR_PICKER,
  },
  {
    label: 'Border Color',
    name: 'borderColor',
    required: false,
    placeholder: 'Pick a border color',
    type: InputEnum.COLOR_PICKER,
  },
  {
    label: 'Text Size',
    name: 'fontSize',
    required: false,
    placeholder: 'Select text size',
    type: InputEnum.SELECT,
    options: [
      { value: '12', label: 'Small' },
      { value: '16', label: 'Medium' },
      { value: '18', label: 'Large' },
      { value: '24', label: 'Extra Large' },
      { value: '32', label: 'Huge' },
    ],
  },
  {
    label: 'Font Family',
    name: 'fontFamily',
    required: false,
    placeholder: 'Select font family',
    type: InputEnum.SELECT,
    options: [
      { label: 'Arial', value: 'Arial' },
      { label: 'Helvetica', value: 'Helvetica' },
      { label: 'Times New Roman', value: 'Times New Roman' },
      { label: 'Courier New', value: 'Courier New' },
      { label: 'Verdana', value: 'Verdana' },
      { label: 'Georgia', value: 'Georgia' },
      { label: 'Palatino', value: 'Palatino' },
      { label: 'Garamond', value: 'Garamond' },
      { label: 'Comic Sans MS', value: 'Comic Sans MS' },
      { label: 'Trebuchet MS', value: 'Trebuchet MS' },
    ],
  },
 /*  {
    label: 'Text Align',
    name: 'align',
    required: false,
    placeholder: 'Select text alignment',
    type: InputEnum.SELECT,
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
      { label: 'Justify', value: 'justify' },
    ],
  }, */
]

export const linkInputs: FormInputProps[] = [
  {
    label: 'Label',
    name: 'content',
    required: true,
    placeholder: 'Enter your content',
    type: InputEnum.TEXT,
  },

  {
    label: 'Enter an https:// URL:',
    name: 'url',
    required: true,
    placeholder: 'https://example.com',
    type: InputEnum.TEXT,
    pattern: 'https://.*',
    size: 30,
  },
  ...textInputs.filter((input) => input.name !== 'content'),
]
