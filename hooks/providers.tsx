"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
          },
        },
      }),
  )

  // useEffect(() => {
  //   // Setup tours data
  //   setupTours().catch((error) => {
  //     console.error("Failed to setup tours:", error)
  //   })

  //   // Check if we should replicate tours (triggered by URL parameter)
  //   if (typeof window !== "undefined") {
  //     const urlParams = new URLSearchParams(window.location.search)
  //     if (urlParams.has("replicateTours")) {
  //       // debugReplicateTours()
  //       //   .then(() => {
  //       //     console.log("Tour replication triggered via URL parameter with detailed error logging")
  //       //   })
  //       //   .catch((error) => {
  //       //     console.error("Failed to replicate tours:", error)
  //       //   })
  //     }
  //   }
  // }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

