import { ElementTypes } from '@/_shared/constants'
import { Text } from './Text'
import Konva from 'konva';

export const Link = (props: LinkElement) => {
  const handleClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    window.open(props.url, '_blank')
  }
  return <Text {...props} type={ElementTypes.TEXT} onClick={handleClick} />
}
