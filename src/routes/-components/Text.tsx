import { useRef, useEffect, useState } from 'react'
import { Text as KonvaText, Group, Rect } from 'react-konva'
import Konva from 'konva'

/* const TextElement = {
    bgColor: '#ddd',
    textColor: '#555',
    fontSize: 26,
    fontFamily: 'Calibri',
    padding: 40,
    align: 'center',
    width: 0,
    height: 0,
} */

export const Text = (props: TextElement) => {
  const rectRef = useRef<Konva.Rect>(null)
  const textRef = useRef<Konva.Text>(null)
  const groupRef = useRef<Konva.Group>(null)
  const [rectDimensions, setRectDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (textRef.current) {
      console.log('Calculating text rect...', textRef.current.getSelfRect())
      setRectDimensions(textRef.current.getSelfRect())
    }
  }, [
    textRef.current,
    props.fontSize,
    props.content,
    props.width,
    props.padding,
    props.height,
    props.fontFamily,
  ])

  return (
    <Group
      ref={groupRef}
      x={props?.position?.x ?? 50}
      y={props?.position?.y ?? 50}
      onClick={props.onClick}
      onDragEnd={props.onDragEnd}
      onDragStart={props.onDragStart}
      onMouseDown={props.onMouseDown}
      onDblClick={props.onDblClick}
      dragBoundFunc={(pos) => {
        const group = groupRef.current
        if (!group) return pos

        const stage = group.getStage()
        if (!stage) return pos

        const stageWidth = stage.width()
        const stageHeight = stage.height()

        // This includes text + padding + background rect
        const box = group.getClientRect({ relativeTo: stage })

        const width = box.width
        const height = box.height

        let x = pos.x
        let y = pos.y

        // Clamp to stage
        x = Math.max(0, x)
        y = Math.max(0, y)
        x = Math.min(stageWidth - width, x)
        y = Math.min(stageHeight - height, y)

        return { x, y }
      }}
      draggable
    >
      <Rect
        ref={rectRef}
        x={0}
        y={0}
        stroke={props.borderColor}
        strokeWidth={props.borderWidth}
        fill={props.bgColor}
        width={rectDimensions.width}
        height={rectDimensions.height}
        cornerRadius={props.borderRadius}
      />
      <KonvaText
        ref={textRef}
        x={0}
        y={0}
        text={props.content}
        fontSize={props.fontSize}
        fontFamily={props.fontFamily}
        fill={props.textColor}
        padding={props.padding ?? 5}
        align={props.align}
        width={props.width}
        height={props.height}
      />
    </Group>
  )
}
