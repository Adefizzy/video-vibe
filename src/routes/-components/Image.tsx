import { useRef, useEffect, useState } from 'react'
import { Image as KonvaImage, Group, Rect } from 'react-konva'
import Konva from 'konva'

export const Image = (props: ImageElement) => {
  const groupRef = useRef<Konva.Group>(null)
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (typeof props.image === 'string') {
      const img = new window.Image()
      img.src = props.image
      img.onload = () => {
        setLoadedImage(img)
      }
    } else if (props.image instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.src = e.target?.result as string
        img.onload = () => {
          setLoadedImage(img)
        }
      }
      reader.readAsDataURL(props.image)
    } else {
      setLoadedImage(props.image)
    }
  }, [props.image])

  if (!loadedImage) {
    return null // or a loading placeholder
  }

  return (
    <Group
      ref={groupRef}
      x={props.position?.x ?? 50}
      y={props.position?.y ?? 50}
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

        const width = props.width
        const height = props.height

        let x = pos.x
        let y = pos.y

        // Clamp to stage
        x = Math.max(0, x)
        y = Math.max(0, y)
        x = Math.min(stageWidth - width, x)
        y = Math.min(stageHeight - height, y)

        return { x, y }
      }}
      draggable={props.draggable ?? true}
    >
      {props.bgColor && (
        <Rect
          x={0}
          y={0}
          stroke={props.borderColor}
          strokeWidth={props.borderWidth}
          fill={props.bgColor}
          width={props.width}
          height={props.height}
          cornerRadius={props.borderRadius}
        />
      )}
      <KonvaImage
        x={0}
        y={0}
        image={loadedImage}
        width={props.width}
        height={props.height}
      />
    </Group>
  )
}