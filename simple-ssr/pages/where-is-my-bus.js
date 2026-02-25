'use client'

import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// ===== Dynamic Leaflet (SSR safe) =====
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

// ==============================
// Only recenter ONCE
// ==============================
function RecenterMap({ position }) {
  const { useMap } = require('react-leaflet')
  const map = useMap()
  const hasCentered = useRef(false)

  useEffect(() => {
    if (position && !hasCentered.current) {
      map.setView(position, 15)
      hasCentered.current = true
    }
  }, [position, map])

  return null
}

export default function WhereIsMyBus() {

  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)

  const [routeCoords, setRouteCoords] = useState([])
  const [stops, setStops] = useState([])
  const [buses, setBuses] = useState([])

  const [customIcon, setCustomIcon] = useState(null)
  const [busIcon, setBusIcon] = useState(null)
  const [myLocationIcon, setMyLocationIcon] = useState(null)

  const [currentPosition, setCurrentPosition] = useState(null)

  // ==============================
  // Load Routes ONCE
  // ==============================
  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => setRoutes(data))
  }, [])

  // ==============================
  // Leaflet Icons
  // ==============================
  useEffect(() => {
    import('leaflet').then((L) => {
      window.L = L
      import('leaflet-rotatedmarker').then(() => {

        setCustomIcon(L.icon({
          iconUrl: '/marker-icon.svg',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }))

        setBusIcon(L.icon({
          iconUrl: '/bus.svg',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }))

        setMyLocationIcon(L.icon({
          iconUrl: '/my-location.svg',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }))
      })
    })
  }, [])

  // ==============================
  // Geolocation (stable version)
  // ==============================
  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPosition([
          pos.coords.latitude,
          pos.coords.longitude
        ])
      },
      (err) => {
        console.warn("Geolocation error:", err.message)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  // ==============================
  // Fetch Route Line + Stops
  // ==============================
  useEffect(() => {
    if (!selectedRoute) {
      setRouteCoords([])
      setStops([])
      return
    }

    fetch(`/api/routeLine/${selectedRoute}`)
      .then(res => res.json())
      .then(data => {
        const converted = data.coordinates.map(
          ([lng, lat]) => [lat, lng]
        )
        setRouteCoords(converted)
      })

    fetch(`/api/routeBusStops/${selectedRoute}`)
      .then(res => res.json())
      .then(data => setStops(data))

  }, [selectedRoute])

  // ==============================
  // Fetch Bus Positions (every 2s)
  // ==============================
  useEffect(() => {
    if (!selectedRoute) return

    let isActive = true
    let timeoutId

    const fetchBusPositions = async () => {
      try {
        const res = await fetch(`/api/busPositions/${selectedRoute}`)
        const data = await res.json()

        if (!isActive) return

        setBuses(data)

        // 等 2 秒再发下一次
        timeoutId = setTimeout(fetchBusPositions, 2000)

      } catch (err) {
        console.error(err)

        // 出错也可以继续轮询
        timeoutId = setTimeout(fetchBusPositions, 2000)
      }
    }

    fetchBusPositions()

    return () => {
      isActive = false
      clearTimeout(timeoutId)
    }

  }, [selectedRoute])

  if (!myLocationIcon) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* Route Selector */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        background: 'rgba(255,255,255,0.92)',
        padding: '14px 16px',
        borderRadius: 16,
        boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
        minWidth: 160
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 8
        }}>
          Select Route
        </div>

        <select
          value={selectedRoute || ''}
          onChange={e => setSelectedRoute(e.target.value || null)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #ddd',
            fontSize: 14,
            fontFamily: 'inherit'
          }}
        >
          <option value="">-- Choose --</option>
          {routes.map(route => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={[-37.81, 144.96]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentPosition && (
          <RecenterMap position={currentPosition} />
        )}

        {selectedRoute && (
          <>
            <Polyline positions={routeCoords} />

            {stops.map(stop => (
              <Marker
                key={stop.stop_id}
                position={[stop.stop_lat, stop.stop_lon]}
                icon={customIcon}
              >
                <Popup offset={[0, -30]}>
                  {stop.stop_name}
                </Popup>
              </Marker>
            ))}

            {buses.map(bus => (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={busIcon}
                rotationAngle={bus.bearing}
                rotationOrigin="center"
              >
                <Popup offset={[0, -20]}>
                  Bus {bus.id}
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={myLocationIcon}
          >
            <Popup offset={[0, -20]}>
              你的位置
            </Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  )
}