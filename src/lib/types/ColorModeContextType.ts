import { colorMode } from "./colorMode";


export type ColorModeContextType = {
 mode: colorMode;
 toggleColorMode: () => void;
};