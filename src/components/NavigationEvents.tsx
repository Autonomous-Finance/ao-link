"use client"

import { useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"

import Mixpanel from "@/components/Mixpanel"

export function NavigationEvents() {
  const location = useLocation()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${location.pathname}?${searchParams}`
    Mixpanel.track("Page View", {
      url: url,
    })
    // You can now use the current URL
    // ...
  }, [location, searchParams])

  return null
}
