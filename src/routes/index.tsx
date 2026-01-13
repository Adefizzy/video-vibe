import { createFileRoute } from '@tanstack/react-router'
import { Stage, Layer } from 'react-konva'
import { Text as TextComponent } from './-components/Text'
import { Link as LinkComponent } from './-components/Link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'
import { ElementTypes } from '@/_shared/constants'

export const Route = createFileRoute('/')({
  component: App,
})


/*  <Text
                  text={text1}
                  fontSize={26}
                  fontFamily="Calibri"
                  textColor="#fff"
                  padding={40}
                  align="center"
                  width={300}
                  //borderRadius={10}
                  borderWidth={1}
                  borderColor="#555"
                  bgColor="black"
                /> */

const textElement: TextElement = {
  type: ElementTypes.TEXT,
  text: 'New Text',
  bgColor: 'black',
  textColor: 'white',
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
  text: 'New Link',
  bgColor: 'black',
  textColor: 'white',
  fontSize: 26,
  fontFamily: 'Calibri',
  align: 'left',
  position: {
    x: 50,
    y: 50,
  },
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [elements, setElements] = useState<Array<TextElement | LinkElement>>([])

  useEffect(() => {
    if (containerRef.current) {
      setContainerDimensions(containerRef.current.getBoundingClientRect())
    }
  }, [containerRef.current])

  const addElement = (type: ElementTypes) => {
    switch (type) {
      case ElementTypes.TEXT:
        setElements([...elements, { ...textElement, clientId: uuidv4() }])
        break
      case ElementTypes.LINK:
        setElements([...elements, { ...linkElement, clientId: uuidv4() }])
        break
      default:
        break
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-12 container mx-auto h-[80vh] border border-gray-200 rounded-lg">
        <div className="col-span-9 h-full px-5 ">
          <div className="w-full h-[20%]  border-b border-gray-200">
            <Button onClick={() => addElement(ElementTypes.TEXT)}>
              Add Text
            </Button>
            <Button onClick={() => addElement(ElementTypes.LINK)}>
              Add Link
            </Button>
          </div>
          <div ref={containerRef} className="w-full h-[80%]">
            <Stage
              width={containerDimensions.width}
              height={containerDimensions.height}
            >
              <Layer>
                {elements.map((element) => {
                  if (element.type === ElementTypes.TEXT) {
                    return <TextComponent key={element.clientId} {...element} />
                  }
                  if (element.type === ElementTypes.LINK) {
                    return <LinkComponent key={element.clientId} {...element} />
                  }
                })}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className="col-span-3 h-full border-l border-gray-200"></div>
      </div>
    </div>
  )
}
