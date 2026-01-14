import { ElementTypes } from '@/_shared/constants'
import { Text } from './Text'

export const Link = (props: LinkElement) => {
  const handleClick = () => {
    window.open(props.url, '_blank')
  }
  return <Text {...props} type={ElementTypes.TEXT} onDblClick={handleClick} />
}
