export default function handler(req, res) {
  res.status(200).json([
    { id: '6522AO', lat: -37.78998, lng: 145.02666, bearing: 133 },
    { id: 'BS05CA', lat: -37.81815, lng: 145.12384, bearing: 215 },
    { id: 'BS05DI', lat: -37.814877, lng: 144.95326, bearing: 209 },
    { id: 'BS05AT', lat: -37.81862, lng: 145.12776, bearing: 273 },
  ])
}