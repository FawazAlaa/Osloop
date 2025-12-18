'use client';
import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { colorMode } from '../types/colorMode';
import { createAppTheme } from '../Theme/theme';
import { ColorModeContextType } from '../types/ColorModeContextType';

//ne3mal el context el awl
const ColorModeContext = createContext<ColorModeContextType | undefined>(
 undefined,
);
//w deh el btesd5dmo for check
export const useColorMode = () => {
 const ctx = useContext(ColorModeContext);
 if (!ctx) throw new Error('useColorMode must be used inside ThemeProviderClient');
 return ctx;
};

export default function ThemeProviderClient({ children }: { children: ReactNode }) {

 const prefersDark = useMediaQuery('(prefers-color-scheme: dark)'); //3amla zai el string query b true or false
 const [mode, setMode] = useState<colorMode>(prefersDark ? 'dark' : 'light');

 const colorMode = useMemo(
   () => ({
     mode,
     toggleColorMode: () =>
       setMode(prev => (prev === 'light' ? 'dark' : 'light')),
   }),
   [mode],
 );

 const theme = useMemo(() => createAppTheme(mode), [mode]);

 return (
    // da el theme beta3 el useMemo el hoa goa el theme provider ana 7a3'iro 3la state 
    // el mode fa da became el context
   <ColorModeContext.Provider value={colorMode}> 
   {/* Hna ba2a it is different da el themeprovider from mui beya5od theme el hoa el theme
   mn hna el use function that we created get design to set the theme  */}
     <ThemeProvider theme={theme}>{children}</ThemeProvider>
   </ColorModeContext.Provider>
 );
}
