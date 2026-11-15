import { createContext, useContext } from 'react';

export const MenuConfigContext = createContext(null);

export function useMenuConfig() {
  return useContext(MenuConfigContext);
}
