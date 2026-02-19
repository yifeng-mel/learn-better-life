'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

import { stops, lineString, routeInfo, testBuses } from '../data/route302'

// SSR 安全加载
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

export default function WhereIsMyBus() {
  const [routeCoords, setRouteCoords] = useState([])
  const [customIcon, setCustomIcon] = useState(null)
  const [busIcon, setBusIcon] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [buses, setBuses] = useState([]) // 测试公交车数据

  useEffect(() => {
    // 处理路线坐标
    const converted = lineString.coordinates.map(([lng, lat]) => [lat, lng])
    setRouteCoords(converted)

    // 只在浏览器创建 icon + 加载 rotatedmarker 插件
    import('leaflet').then((L) => {
      // ⭐ 关键：把 L 挂到全局
      window.L = L

      // 再加载 rotatedmarker 插件
      import('leaflet-rotatedmarker').then(() => {

        const stopMarker = L.icon({
          iconUrl: '/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: null,
        })
        setCustomIcon(stopMarker)

        const busMarker = L.icon({
          iconUrl: '/bus.svg',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -10],
          shadowUrl: null,
        })
        setBusIcon(busMarker)
      })
    })

    setBuses(testBuses)

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
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return

    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCurrentPosition([pos.coords.latitude, pos.coords.longitude])
        },
        err => {
          console.error('获取地理位置失败', err)
        }
      )
    }

    updatePosition() // 页面加载时立即获取一次
    const interval = setInterval(updatePosition, 500 * 1000) // 每 500 秒更新一次
    return () => clearInterval(interval)
  }, [])

  if (!routeCoords.length || !customIcon || !busIcon) return null

  const mapCenter = currentPosition || routeCoords[0]

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 路线 */}
        <Polyline positions={routeCoords} />

        {/* 站点 */}
        {stops.map(stop => (
          <Marker
            key={stop.stop_id}
            position={[stop.stop_lat, stop.stop_lon]}
            icon={customIcon}
          >
            <Popup>
              <b>{routeInfo.routeShortName}</b>
              <br />
              {stop.stop_name}
            </Popup>
          </Marker>
        ))}

        {/* 公交车 */}
        {buses.map(bus => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={busIcon}
            rotationAngle={bus.bearing}
            rotationOrigin="center"
          >
            <Popup>
              <b>Bus {bus.id}</b>
              <br />
              Bearing: {bus.bearing}°
            </Popup>
          </Marker>
        ))}

        {/* 当前用户位置 */}
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={customIcon}
          >
            <Popup>
              <b>你的位置</b>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}