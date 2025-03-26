'use client'
import { Providers } from "@/hooks/providers"
import { ReactNode } from "react"

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <div id="root">
      <Providers>
        {children}
      </Providers>
    </div>
  )
}

export default App