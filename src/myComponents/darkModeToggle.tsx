
'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from  '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useColorMode } from '../lib/providers/colorThemeProvider';

export default function DarkModeToggle() {
 const { mode, toggleColorMode } = useColorMode();

 return (
   <Tooltip title="Toggle light/dark mode">
     <IconButton onClick={toggleColorMode} size="medium" >
       {mode === 'light' ? <DarkModeIcon sx={{
    color: "#2070B3",
    "&:hover": {
      color: "#28679E", 
    },
  }} /> : <LightModeIcon  sx={{
    color: "#facc15",
    "&:hover": {
      color: "#fde047", 
    },
  }} />}
     </IconButton>
   </Tooltip>
 );
}
