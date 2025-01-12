import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';

export const darkTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,
    typography: {
        fontFamily:'SF Pro Display',
        
        body1: {},
        body2: {},
        subtitle1: {},
        subtitle2: {},
    },
    palette: {
      type: 'dark',
    },

    overrides: {
      MuiTouchRipple: {
        root: {
          opacity: 0.15,
        },
      },
    },
  }),

  intensity: 0.45,

  backgroundColor: '#000000',
  sectionBackgroundColor: '#212121',
  highlightBackgroundColor: '#363c5f',
  hoverBackgroundColor: 'rgba(37, 117, 164, 0.05)',

  textColor: '#ffffff',
  dimTextColor: 'rgba(255, 255, 255, 0.5)',

  colors: {
    positive: '#15cc93',
    negative: '#e95979',
    warning: '#ff9a63',
    primary: '#FBD85D',
    primaryDark: '#15cc93',
    secondary: '#FBD85D',
    secondaryDark: '#15cc93',
  },

  header: {
    backgroundColor: '#000000',
    textColor: '#4BDB4B',
  },

  messageBox: {
    borderColor: '#4BDB4B',
    backgroundColor: 'rgba(75, 219, 75, 0.1)',
    textColor: '#285e28',
    linkColor: '#4BDB4B',
  },

  chart: [
    '#4bdb4b',
    '#36a337',
    '#2d832d',
    '#246d25',
    '#174f1a',
    '#0e3311',
    '#101010',
  ],

  //errorTextColor: '#ac2b45',
  //positiveTextColor: '#15cc93',
  //pointColor: '#15cc93',

  label: {
    backgroundColor: '#493B3B',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  actionButton: {
    backgroundColor: '#493B3B',
    backgroundHoverColor: '#404872',
    textColor: '#ffffff',
    hoverTextColor: '#ffffff',
  },

  textButton: {
    textColor: '#ffffff',
  },

  borderButton: {
    borderColor: '#493B3B',
    borderHoverColor: '#404872',
    textColor: '#ffffff',
    hoverTextColor: '#ffffff',
  },

  selector: {
    backgroundColor: '#493B3B',
    textColor: '#ffffff',
  },

  formControl: {
    labelColor: 'rgba(255, 255, 255, 0.5)',
    labelFocusedColor: '#3867c4',
    labelErrorColor: '#ac2b45',
  },

  textInput: {
    backgroundColor: '#1b1e31',
    textColor: '#ffffff',
  },

  table: {
    head: {
      textColor: 'rgba(255, 255, 255, 0.5)',
    },
    body: {
      textColor: '#ffffff',
    },
  },

  slider: {
    thumb: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      thumbColor: '#ffffff',
    },
  },

  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    lightColor: 'rgba(255, 255, 255, 0.2)',
  },

  dialog: {
    normal: {
      backgroundColor: '#1f2237',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#1f2237',
      textColor: '#d69f34',
    },
    error: {
      backgroundColor: '#1f2237',
      textColor: '#ac2b45',
    },
    success: {
      backgroundColor: '#1f2237',
      textColor: '#3e9bba',
    },
  },

  tooltip: {
    normal: {
      backgroundColor: '#363d5e',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#d69f34',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ac2b45',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },

  snackbar: {
    normal: {
      backgroundColor: '#363d5e',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#d69f34',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ac2b45',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },
};
