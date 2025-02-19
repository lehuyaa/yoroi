import {Palette} from '../types'

export const lightPalette: Palette = {
  'black-static': '#000000',
  'white-static': '#FFFFFF',
  gray: {
    max: '#000000',
    900: '#242838',
    800: '#383E54',
    700: '#4A5065',
    600: '#6B7384',
    500: '#8A92A3',
    400: '#A7AFC0',
    300: '#C4CAD7',
    200: '#DCE0E9',
    100: '#EAEDF2',
    50: '#F0F3F5',
    min: '#FFFFFF',
  },
  primary: {
    900: '#121F4D',
    800: '#122770',
    700: '#1737A3',
    600: '#3154CB',
    500: '#4B6DDE',
    400: '#7892E8',
    300: '#A0B3F2',
    200: '#C4CFF5',
    100: '#E4E8F7',
  },
  secondary: {
    900: '#17453C',
    800: '#12705D',
    700: '#0B997D',
    600: '#08C29D',
    500: '#16E3BA',
    400: '#66F2D6',
    300: '#93F5E1',
    200: '#C6F7ED',
    100: '#E4F7F3',
  },
  magenta: {
    700: '#CF053A',
    600: '#E80742',
    500: '#FF1351',
    300: '#FBCBD7',
    100: '#FFF1F5',
  },
  cyan: {
    500: '#59B1F4',
    100: '#F2F9FF',
  },
  yellow: {
    500: '#ECBA09',
    100: '#FDF7E2',
  },
  gradients: {
    'blue-green': ['#E4E8F7', '#C6F7F7'],
    green: ['#93F5E1', '#C6F7F7'],
    blue: ['#244ABF', '#4B6DDE'],
  },
  'overlay-extension': {hex: '#121f4d', opacity: 0.7},
  'overlay-mobile': {hex: '#000000', opacity: 0.4},
  'sidebar-overlay': {hex: '#000000', opacity: 0.16},
  'sidebar-item': {hex: '#ffffff', opacity: 0.48},
}
