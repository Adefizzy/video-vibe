import { useForm } from 'react-hook-form'
import { ITextSchema, TextSchema, LinkSchema, ILinkSchema } from './helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ElementTypes } from '@/_shared/constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ReactPlayerProps } from 'react-player/types'

const textElement: TextElement = {
  type: ElementTypes.TEXT,
  content: 'New Text',
  bgColor: '#000',
  textColor: '#fff',
  fontSize: 26,
  fontFamily: 'Calibri',
  align: 'left',
  position: {
    x: 50,
    y: 50,
  },
}

const linkElement: LinkElement = {
  type: ElementTypes.LINK,
  url: 'https://www.google.com',
  content: 'New Link',
  bgColor: '#000',
  textColor: '#fff',
  fontSize: 26,
  fontFamily: 'Calibri',
  align: 'left',
  position: {
    x: 50,
    y: 50,
  },
}

export const useVideoBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoPlayerRef = useRef<ReactPlayerProps>(null)
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [elements, setElements] = useState<Array<TextElement | LinkElement>>([])
  const [selectedElementId, setSelectedElementId] = useState<string>('')

  useEffect(() => {
    if (containerRef.current) {
      setContainerDimensions(containerRef.current.getBoundingClientRect())
    }
  }, [containerRef.current])

  const textForm = useForm<ITextSchema>({
    defaultValues: {
      content: '',
      bgColor: '#000',
      // align: 'left',
    },
    resolver: zodResolver(TextSchema),
  })
  const linkForm = useForm<ILinkSchema>({
    defaultValues: {
      content: '',
      url: '',
      // align: 'left',
    },
    resolver: zodResolver(LinkSchema),
  })

  const { watch: watchTextForm } = textForm
  const { watch: watchLinkForm } = linkForm

  const submitText = (data: ITextSchema) => {
    console.log('Form Data:', data)
  }

  const submitLink = (data: ILinkSchema) => {
    console.log('Link Form Data:', data)
  }

  const addElement = (type: ElementTypes) => {
    switch (type) {
      case ElementTypes.TEXT:
        const newElement = { ...textElement, clientId: uuidv4() }
        console.log('Adding new text element:', newElement)
        setElements([...elements, newElement])
        setSelectedElementId(newElement.clientId)
        textForm.reset({
          ...newElement,
          fontSize: String(newElement.fontSize ?? 12),
        })

        break
      case ElementTypes.LINK:
        const newLinkElement = { ...linkElement, clientId: uuidv4() }
        setElements([...elements, newLinkElement])
        setSelectedElementId(newLinkElement.clientId)
        linkForm.reset({
          ...newLinkElement,
          fontSize: String(newLinkElement.fontSize ?? 12),
        })
        break
      default:
        break
    }
  }

  const selectedElement = useMemo(
    () => elements.find((el) => el.clientId === selectedElementId),
    [elements, selectedElementId],
  )

  useEffect(() => {
    const selectedElement = elements.find(
      (el) => el.clientId === selectedElementId,
    )
    const subscriptionText = watchTextForm((data) => {
      if (selectedElement?.type === ElementTypes.TEXT) {
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.clientId === selectedElement.clientId
              ? { ...selectedElement, ...data, fontSize: Number(data.fontSize) }
              : el,
          ),
        )
      }
    })

    return () => {
      subscriptionText.unsubscribe()
    }
  }, [watchTextForm, selectedElementId])

  useEffect(() => {
    const selectedElement = elements.find(
      (el) => el.clientId === selectedElementId,
    )
    const subscriptionLink = watchLinkForm((data) => {
      if (selectedElement?.type === ElementTypes.LINK) {
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.clientId === selectedElement.clientId
              ? { ...selectedElement, ...data, fontSize: Number(data.fontSize) }
              : el,
          ),
        )
      }
    })

    return () => {
      subscriptionLink.unsubscribe()
    }
  }, [watchLinkForm, selectedElementId])

  const handleElementSelect = (clientId?: string) => {
    if (!clientId) return
    setSelectedElementId(clientId)
  }

  return {
    textForm,
    submitText,
    linkForm,
    submitLink,
    addElement,
    containerRef,
    containerDimensions,
    elements,
    selectedElement,
    videoPlayerRef,
    handleElementSelect,
  }
}
