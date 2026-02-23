export default function handler(req, res) {
  res.status(200).json(["302", "304", "401"])
}