import React from 'react'
import Svg, {Path} from 'react-native-svg'

type Props = {
  size?: number
  color?: string
}

export const Bio = ({size = 36, color = 'black'}: Props) => (
  <Svg width={size} height={size} viewBox="-2 -2 28 28">
    <Path
      d="M5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V7C4 7.55228 3.55228 8 3 8C2.44772 8 2 7.55228 2 7V5C2 4.20435 2.31607 3.44129 2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H7C7.55228 2 8 2.44772 8 3C8 3.55228 7.55228 4 7 4H5Z"
      fill={color}
    />

    <Path
      d="M16 3C16 2.44772 16.4477 2 17 2H19C19.7957 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V7C22 7.55228 21.5523 8 21 8C20.4477 8 20 7.55228 20 7V5C20 4.73478 19.8946 4.48043 19.7071 4.29289C19.5196 4.10536 19.2652 4 19 4H17C16.4477 4 16 3.55228 16 3Z"
      fill={color}
    />

    <Path
      d="M22 17C22 16.4477 21.5523 16 21 16C20.4477 16 20 16.4477 20 17V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H17C16.4477 20 16 20.4477 16 21C16 21.5523 16.4477 22 17 22H19C19.7957 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7957 22 19V17Z"
      fill={color}
    />

    <Path
      d="M3 16C3.55228 16 4 16.4477 4 17V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H7C7.55228 20 8 20.4477 8 21C8 21.5523 7.55228 22 7 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7957 2 19V17C2 16.4477 2.44772 16 3 16Z"
      fill={color}
    />

    <Path
      d="M8 9C8 9.55228 8.44772 10 9 10C9.55228 10 10 9.55228 10 9V8C10 7.44772 9.55228 7 9 7C8.44772 7 8 7.44772 8 8V9Z"
      fill={color}
    />

    <Path
      d="M15 10C14.4477 10 14 9.55228 14 9V8C14 7.44772 14.4477 7 15 7C15.5523 7 16 7.44772 16 8V9C16 9.55228 15.5523 10 15 10Z"
      fill={color}
    />

    <Path
      d="M12.9285 11.3714C13.1336 10.8586 12.8842 10.2766 12.3714 10.0715C11.8586 9.8664 11.2766 10.1158 11.0715 10.6286L9.07153 15.6286C8.94829 15.9367 8.98591 16.2858 9.17194 16.5606C9.35797 16.8354 9.66818 17 10 17H13C13.5523 17 14 16.5523 14 16C14 15.4477 13.5523 15 13 15H11.477L12.9285 11.3714Z"
      fill={color}
    />
  </Svg>
)
