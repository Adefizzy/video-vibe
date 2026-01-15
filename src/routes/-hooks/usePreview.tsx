import { useEffect, useRef, useState } from 'react'

export const usePreview = () => {
  const [elements, setElements] = useState<Array<TextElement | LinkElement | ImageElement>>([])
  const [project, setProject] = useState<{
    projectName: string
    videoUrl: string
  }>({ projectName: '', videoUrl: '' })
  const [currentTime, setCurrentTime] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (containerRef.current) {
      setContainerDimensions(containerRef.current.getBoundingClientRect())
    }
  }, [containerRef.current])

  useEffect(() => {
    if (localStorage.getItem('previewElements')) {
      setElements(JSON.parse(localStorage.getItem('previewElements') || '[]'))
    }

    if (localStorage.getItem('previewProject')) {
      setProject(JSON.parse(localStorage.getItem('previewProject') || '{}'))
    }
  }, [])

  const visibleElements = elements.filter(
    (el) =>
      currentTime >= (el?.startTime ?? 0) && currentTime <= (el?.endTime ?? 0),
  )

  return {
    elements: visibleElements,
    project,
    currentTime,
    setCurrentTime,
    containerRef,
    containerDimensions,
  }
}
