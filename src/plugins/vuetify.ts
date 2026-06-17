import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import '../styles/layers.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'gamingTheme',
    themes: {
      gamingTheme: {
        dark: false,
        colors: {
          primary: '#03037F',
          secondary: '#ffb403',
          background: '#00072B',
          surface: '#FFFFFF',

          deepBlue: '#03037F',
          imperialYellow: '#FFB404',
          vividOrange: '#FA6600',
          midnightBlue: '#00072B',
          azureBlue: '#0686F3',
          neonBlue: '#00DDFE',
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
