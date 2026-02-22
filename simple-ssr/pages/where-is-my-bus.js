'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// ====== 路线数据（目前 302） ======
import {
  stops as stops302,
  lineString as line302,
  routeInfo as routeInfo302,
  testBuses as testBuses302
} from '../data/route302'

// ====== 动态加载 react-leaflet（SSR 安全） ======
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

// ====== 自动居中组件 ======
function RecenterMap({ position }) {
  const map = require('react-leaflet').useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, 15)
    }
  }, [position, map])

  return null
}

export default function WhereIsMyBus() {

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])
  const [stops, setStops] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)
  const [buses, setBuses] = useState([])

  const [customIcon, setCustomIcon] = useState(null)
  const [busIcon, setBusIcon] = useState(null)
  const [myLocationIcon, setMyLocationIcon] = useState(null)

  const [currentPosition, setCurrentPosition] = useState(null)

  // ==============================
  // 初始化 Leaflet Icon
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
  // 获取用户当前位置
  // ==============================
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurrentPosition([
          pos.coords.latitude,
          pos.coords.longitude
        ])
      },
      err => {
        console.error('获取定位失败', err)
      }
    )
  }, [])

  // ==============================
  // 选择线路后加载数据
  // ==============================
  useEffect(() => {

    if (!selectedRoute) {
      setRouteCoords([])
      setStops([])
      setRouteInfo(null)
      setBuses([])
      return
    }

    if (selectedRoute === '302') {

      const converted = line302.coordinates.map(
        ([lng, lat]) => [lat, lng]
      )

      setRouteCoords(converted)
      setStops(stops302)
      setRouteInfo(routeInfo302)
      setBuses(testBuses302)
    }

  }, [selectedRoute])

  // ==============================
  // 模拟公交车移动
  // ==============================
  useEffect(() => {

    if (!selectedRoute) return

    const interval = setInterval(() => {
      setBuses(prev =>
        prev.map(bus => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
        }))
      )
    }, 2000)

    return () => clearInterval(interval)

  }, [selectedRoute])

  if (!myLocationIcon) return null

  return (
    <div style={{ height: '90vh', width: '100%', position: 'relative' }}>

      {/* ====== Enhanced Route Selector UI ====== */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.9)',
        padding: '14px 16px',
        borderRadius: 14,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        minWidth: 180,
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 8,
          color: '#444',
          letterSpacing: 0.5
        }}>
          Select Route
        </div>

        <select
          value={selectedRoute || ''}
          onChange={e =>
            setSelectedRoute(e.target.value || null)
          }
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #ddd',
            fontSize: 14,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="">-- Choose --</option>
          <option value="302">302</option>
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
                <Popup>
                  <b>{routeInfo?.routeShortName}</b>
                  <br />
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
                <Popup>
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
            <Popup>你的位置</Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  )
}