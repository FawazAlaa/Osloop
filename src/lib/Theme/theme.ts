import {createTheme , ThemeOptions} from '@mui/material/styles'
import { colorMode } from '../types/colorMode';
//https://dev.to/douglasporto/styling-your-site-with-nextjs-and-mui-creating-a-dynamic-theme-switcher-20c0
export const getDesign= (mode: colorMode): ThemeOptions => ({
 palette: {
  mode,
  primary: {
    main: mode === 'light' ? '#1976d2' : '#90caf9',
  },
  secondary: {
    main: '#f50057',
  },
  background: {
    default: mode === 'light' ? '#f5f5f5' : '#121212',
    paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
  },
},
shape: {
  borderRadius: 12,
},
components: {
  MuiCard: {
    styleOverrides: {
      root: {
        padding: 16,
      },
    },
  },
},
});

export const createAppTheme = (mode: colorMode) =>
createTheme(getDesign(mode));
