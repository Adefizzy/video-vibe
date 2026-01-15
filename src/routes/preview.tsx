import { createFileRoute } from '@tanstack/react-router'
import { Stage, Layer } from 'react-konva'
import { Text as TextComponent } from './-components/Text'
import { Link as LinkComponent } from './-components/Link'
import { ElementTypes } from '@/_shared/constants'
import { Image as ImageComponent } from './-components/Image'
import ReactPlayer from 'react-player'
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from 'media-chrome/react'
import { usePreview } from './-hooks/usePreview'

export const Route = createFileRoute('/preview')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    elements,
    project,
    setCurrentTime,
    containerRef,
    containerDimensions,
  } = usePreview()

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-12 container mx-auto h-[80vh] border border-gray-200 rounded-lg">
        <div className="col-span-9 h-full px-5  ">
          <div className="w-full h-[80%] bg-red-400 relative">
            <div ref={containerRef} className="w-full h-[95%] z-50 absolute">
              <Stage
                width={containerDimensions.width}
                height={containerDimensions.height}
              >
                <Layer>
                  {elements.map((element) => {
                    if (element.type === ElementTypes.TEXT) {
                      return (
                        <TextComponent
                          key={element.clientId}
                          {...element}
                          draggable={false}
                        />
                      )
                    }
                    if (element.type === ElementTypes.LINK) {
                      return (
                        <LinkComponent
                          key={element.clientId}
                          {...element}
                          draggable={false}
                        />
                      )
                    }

                    if (element.type === ElementTypes.IMAGE) {
                      return (
                        <ImageComponent
                          key={element.clientId}
                          {...element}
                          draggable={false}
                        />
                      )
                    }
                  })}
                </Layer>
              </Stage>
            </div>
            <MediaController
              style={{
                width: '100%',
                aspectRatio: '16/9',
              }}
            >
              <ReactPlayer
                slot="media"
                src={project?.videoUrl}
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  // '--controls': 'none',
                }}
                onTimeUpdate={(time) => {
                  setCurrentTime(time.currentTarget.currentTime)
                }}
  
              ></ReactPlayer>
              <MediaControlBar>
                <MediaPlayButton />
                <MediaSeekBackwardButton seekOffset={10} />
                <MediaSeekForwardButton seekOffset={10} />
                <MediaTimeRange />
                <MediaTimeDisplay showDuration />
                <MediaMuteButton />
                <MediaVolumeRange />
                <MediaPlaybackRateButton />
                <MediaFullscreenButton />
              </MediaControlBar>
            </MediaController>
          </div>
        </div>
      </div>
    </div>
  )
}
