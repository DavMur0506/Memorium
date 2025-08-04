'use client'
import { createContext, useContext } from "react"


const MobileContext = createContext({ isMobile: false })

export function MobileProvider({
  children,
  isMobile,
}) {
  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

export const useMobile = () => useContext(MobileContext);