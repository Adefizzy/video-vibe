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
  text: string
  position?: {
    x?: number
    y?: number
  }
  onClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onDragEnd?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onDragStart?: (event: Konva.KonvaEventObject<MouseEvent>) => void
  onMouseDown?: (event: Konva.KonvaEventObject<MouseEvent>) => void
}

interface LinkElement extends TextElement {
  type: 'link'
  url: string
}
