export default function handler(req, res) {
  res.status(200).json([
    {
      stop_id: 19648,
      stop_name: "Box Hill Bus Station/Station St",
      stop_lat: -37.8198278,
      stop_lon: 145.12214065
    },
    {
      stop_id: 19549,
      stop_name: "King St/Lonsdale St",
      stop_lat: -37.81428813,
      stop_lon: 144.95512439
    },
    {
      stop_id: 4950,
      stop_name: "Balwyn Rd/Belmore Rd",
      stop_lat: -37.80356307,
      stop_lon: 145.08254956
    }
  ])
}