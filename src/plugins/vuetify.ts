import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import '../styles/layers.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'gamingTheme',
    themes: {
      gamingTheme: {
        dark: true,
        colors: {
          'primary': '#03037F',
          'secondary': '#ffb403',
          'background': '#00072B',

          'surface': '#0f1637', // rgba(255, 255, 255, 0.06)
          'surface-light': '#1a2041', // rgba(255, 255, 255, 0.10)
          'on-surface': '#8c8f9f', // rgba(255, 255, 255, 0.55)
          'on-surface-light': '#474c66', // rgba(255, 255, 255, 0.28)

          'on-background': '#e8eaf0',

          'deepBlue': '#03037F',
          'imperialYellow': '#FFB404',
          'vividOrange': '#FA6600',
          'midnightBlue': '#00072B',
          'azureBlue': '#0686F3',
          'neonBlue': '#00DDFE',
        },
        variables: {
          // 'border-color': 'rgba(0, 221, 254, 0.18)',
          'border-color': 'rgba(29, 35, 67)', // rgba(255, 255, 255, 0.08)
          'border-color-highlight': 'rgba(53, 58, 87)', // rgba(255, 255, 255, 0.3)
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  },
})
