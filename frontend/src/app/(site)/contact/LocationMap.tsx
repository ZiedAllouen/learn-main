'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 12, Rue de la Kasbah — 1008 Tunis (Médina, near Place de la Kasbah)
const LAT = 36.798
const LNG = 10.168
const LABEL = '12, Rue de la Kasbah — Tunis'

export function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [LAT, LNG],
      zoom: 16,
      scrollWheelZoom: false, // avoid hijacking page scroll
      attributionControl: true,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Custom terracotta pin matching the brand palette (#C4622D)
    const icon = L.divIcon({
      className: 'bsmk-map-pin',
      html: `
        <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.716 23.284 0 15 0z" fill="#C4622D"/>
          <circle cx="15" cy="15" r="5.5" fill="#F5F5F0"/>
        </svg>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -38],
    })

    L.marker([LAT, LNG], { icon, title: LABEL })
      .addTo(map)
      .bindPopup(`<strong>BSMK</strong><br/>${LABEL}`)

    // Re-fit once the container has its final size (responsive layouts)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    // Initial settle after mount/layout
    const t = window.setTimeout(() => map.invalidateSize(), 0)

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`Carte — ${LABEL}`}
      className="h-64 sm:h-80 lg:h-96 w-full rounded-xl overflow-hidden z-0"
    />
  )
}
