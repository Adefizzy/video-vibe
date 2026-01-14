interface TextElement {
  type: 'text'
  id?: string
  clientId?: string
  bgColor?: string
  textColor?: string
  fontSize?: number
  fontFamily?: string
  padding?: number
  align?: string
  width?: number
  height?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  content: string
  startTime?: number
  endTime?: number
  position?: {
    x?: number
    y?: number
  }
  onClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onDragEnd?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onDragStart?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onMouseDown?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onDblClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void
}

interface LinkElement extends TextElement {
  type: 'link'
  url: string
}


type FormInputProps = {
  type: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  name: string;
  options?: Option[];
  defaultValue?: Option | string;
  isMulti?: boolean;
  isClearable?: boolean;
  isSettings?: boolean;
  disabled?: boolean;
  className?: string;
  labelStyle?: string;
  pattern?: string;
  size?: number;
  videoDuration?: number;
};